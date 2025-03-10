import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Res,
  Body,
  HttpStatus,
  NotFoundException,
  Logger,
  HttpCode,
  Query,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { Throttle } from "@nestjs/throttler";

import { UrlsService, ClientInfo } from "./urls.service";
import {
  AccessUrlDto,
  CreateUrlDto,
  UrlAnalyticsDto,
  UrlFiltersDto,
  UrlResponseDto,
  UrlSearchResponseDto,
} from "./dto/urls.dto";
import { AuthenticatedUser } from "src/common/decorators/user.decorator";
import { User } from "src/database/entities/user.entity";
import { Public } from "src/common/decorators/public.decorator";
import { getClientInfo } from "src/common/utils";

@Controller()
@ApiBearerAuth()
export class UrlsController {
  private readonly logger = new Logger(UrlsController.name);

  constructor(
    private readonly urlsService: UrlsService,
    private configService: ConfigService
  ) {}

  @Post("shorten")
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a shortened URL" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "URL shortened successfully",
    type: UrlResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input or alias already taken",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized access",
  })
  async shortenUrl(
    @AuthenticatedUser() user: User,
    @Body() createUrlDto: CreateUrlDto
  ): Promise<UrlResponseDto> {
    return this.urlsService.createUrl(user, createUrlDto);
  }

  @Get("urls")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all URLs for the authenticated user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "URLs retrieved successfully",
    type: UrlSearchResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized access",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getUserUrls(
    @AuthenticatedUser() user: User,
    @Query() filters: UrlFiltersDto,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ): Promise<UrlSearchResponseDto> {
    return this.urlsService.searchUrls(
      user,
      filters,
      page ? parseInt(page.toString(), 10) : 1,
      limit ? parseInt(limit.toString(), 10) : 20
    );
  }

  @Get("analytics/:shortUrl")
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get analytics for a specific URL" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "URL analytics retrieved successfully",
    type: UrlAnalyticsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "URL not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Access denied to this URL",
  })
  @ApiParam({ name: "alias", description: "URL alias/short code" })
  @ApiQuery({ name: "startDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  async getUrlAnalytics(
    @AuthenticatedUser() user: User,
    @Param("shortUrl") alias: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<UrlAnalyticsDto> {
    const startDateTime = startDate ? new Date(startDate) : undefined;
    const endDateTime = endDate ? new Date(endDate) : undefined;

    return this.urlsService.getUrlAnalytics(
      alias,
      user,
      startDateTime,
      endDateTime
    );
  }

  /**
   * Handle short URL redirection
   */
  @Get(":shortUrl")
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 60 } }) // 60 requests per minute
  @ApiOperation({ summary: "Redirect to original URL" })
  @ApiParam({ name: "shortUrl", description: "Short URL alias" })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: "Redirects to original URL",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns information for password-protected URLs",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "URL not found or expired",
  })
  async redirectToOriginalUrl(
    @Param("shortUrl") alias: string,
    @Req() req: Request,
  ): Promise<any> {
    const clientInfo = getClientInfo(req);

    return await this.urlsService.getRedirectUrl(alias, clientInfo);
  }

  /**
   * Handle password submission for protected URLs
   */
  @Post(":shortUrl/access")
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 requests per minute
  @ApiOperation({ summary: "Access password-protected URL" })
  @ApiParam({ name: "shortUrl", description: "Short URL alias" })
  @ApiBody({ type: AccessUrlDto })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: "Redirects to original URL",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the original URL (for API clients)",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Incorrect password",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "URL not found or expired",
  })
  async accessProtectedUrl(
    @Param("shortUrl") alias: string,
    @Body() accessUrlDto: AccessUrlDto,
    @Req() req: Request
  ) {
    const clientInfo = getClientInfo(req);

    return await this.urlsService.accessProtectedUrl(
      alias,
      accessUrlDto,
      clientInfo
    );
  }
}
