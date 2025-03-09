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
    @Param("alias") alias: string,
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
  @ApiParam({ name: "alias", description: "Short URL alias" })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: "Redirects to original URL",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "URL not found or expired",
  })
  async redirectToOriginalUrl(
    @Param("alias") alias: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // Extract client info
    const clientInfo = getClientInfo(req);

    try {
      const result = await this.urlsService.getRedirectUrl(alias, clientInfo);

      if (result.isPasswordProtected) {
        // If password protected, render password form
        return res.render("password-form", { alias });
      }

      // Redirect to the original URL
      return res.redirect(HttpStatus.FOUND, result.originalUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Render a custom 404 page
        return res.status(HttpStatus.NOT_FOUND).render("not-found", {
          message: error.message,
          baseUrl: this.configService.get("APP_URL"),
        });
      }

      // For other errors, let the exception filter handle it
      throw error;
    }
  }

  /**
   * Handle password submission for protected URLs
   */
  @Post(":shortUrl/access")
  @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 requests per minute
  @ApiOperation({ summary: "Access password-protected URL" })
  @ApiParam({ name: "alias", description: "Short URL alias" })
  @ApiBody({ type: AccessUrlDto })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: "Redirects to original URL",
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
    @Param("alias") alias: string,
    @Body() accessUrlDto: AccessUrlDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // Extract client info
    const clientInfo = getClientInfo(req);

    try {
      const originalUrl = await this.urlsService.accessProtectedUrl(
        alias,
        accessUrlDto,
        clientInfo
      );

      // Redirect to the original URL
      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Render a custom 404 page
        return res.status(HttpStatus.NOT_FOUND).render("not-found", {
          message: error.message,
          baseUrl: this.configService.get("APP_URL"),
        });
      }

      // For password errors, render the form again with error message
      return res.status(HttpStatus.BAD_REQUEST).render("password-form", {
        alias,
        error: error.message,
      });
    }
  }
}
