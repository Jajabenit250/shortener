import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, ILike } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { Url } from "../../database/entities/url.entity";
import { User } from "../../database/entities/user.entity";
import { UrlStatus, UserRole } from "src/common/constants/enum.constant";
import { _400, _404, _403 } from "src/common/constants/error.constant";
import {
  CreateUrlDto,
  UrlResponseDto,
  UrlFiltersDto,
  UrlSearchResponseDto,
  UrlAnalyticsDto,
  AccessUrlDto,
} from "./dto/urls.dto";

// Interface for client information
export interface ClientInfo {
  ipAddress: string;
  userAgent: string;
  referrer: string;
  deviceType: string;
  browser: string;
  visitorId?: string;
}

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // ==================== URL CREATION AND MANAGEMENT ====================

  /**
   * Create a shortened URL - POST /shorten
   */
  async createUrl(
    user: User,
    createUrlDto: CreateUrlDto
  ): Promise<UrlResponseDto> {
    try {
      const { originalUrl, alias, expiresAt, isPasswordProtected, password } =
        createUrlDto;

      // Validate URL
      if (!this.isValidUrl(originalUrl)) {
        throw new BadRequestException(_400.INVALID_URL);
      }

      // Generate or validate alias
      let finalAlias = alias;
      if (!finalAlias) {
        // Generate unique alias
        finalAlias = await this.generateUniqueAlias();
      } else {
        // Check if custom alias is available
        const existingUrl = await this.urlRepository.findOne({
          where: { alias: finalAlias },
        });

        if (existingUrl) {
          throw new BadRequestException(_400.CUSTOM_ALIAS_TAKEN);
        }
      }

      // Handle password protection
      let hashedPassword = null;
      if (isPasswordProtected && password) {
        hashedPassword = await this.hashPassword(password);
      } else if (isPasswordProtected && !password) {
        throw new BadRequestException(_400.PASSWORD_REQUIRED);
      }

      // Create and save the URL
      const url = this.urlRepository.create({
        originalUrl,
        alias: finalAlias,
        userId: user.id,
        expiresAt,
        isPasswordProtected: !!isPasswordProtected,
        password: hashedPassword,
        status: UrlStatus.ACTIVE,
        deviceInfo: {},
        referrers: {},
      });

      const savedUrl = await this.urlRepository.save(url);

      // Return the response DTO
      return this.mapUrlToResponseDto(savedUrl);
    } catch (error) {
      this.logger.error(
        `URL creation failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Search for URLs with filtering and pagination - GET /urls
   */
  async searchUrls(
    user: User,
    filters: UrlFiltersDto,
    page: number = 1,
    limit: number = 20
  ): Promise<UrlSearchResponseDto> {
    try {
      const skip = (page - 1) * limit;

      // Build where conditions
      let where: FindOptionsWhere<Url> | FindOptionsWhere<Url>[] = {};

      // Regular users can only see their own URLs
      if (user.role !== UserRole.ADMIN) {
        where.userId = user.id;
      }

      // Apply status filter
      if (filters.status) {
        where.status = filters.status;
      } else {
        // By default, exclude deleted URLs
        where.status = UrlStatus.ACTIVE;
      }

      // Apply text search if provided
      if (filters.search) {
        where = [
          { ...where, originalUrl: ILike(`%${filters.search}%`) },
          { ...where, alias: ILike(`%${filters.search}%`) },
          { ...where, title: ILike(`%${filters.search}%`) },
        ];
      }

      // Execute query
      const [urls, total] = await this.urlRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: "DESC" },
      });

      return {
        urls: urls.map((url) => this.mapUrlToResponseDto(url)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `URL search failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  // ==================== URL REDIRECTION & ACCESS ====================

  /**
   * Get original URL for redirection by alias
   */
  async getRedirectUrl(
    alias: string,
    clientInfo: ClientInfo
  ): Promise<{ originalUrl: string; isPasswordProtected: boolean }> {
    try {
      // Try to get URL from cache first
      const cacheKey = `url:${alias}`;
      const cachedUrl = await this.cacheManager.get<{
        originalUrl: string;
        isPasswordProtected: boolean;
        isExpired: boolean;
      }>(cacheKey);

      if (cachedUrl) {
        if (cachedUrl.isExpired) {
          throw new NotFoundException(_404.EXPIRED_URL);
        }

        if (!cachedUrl.isPasswordProtected) {
          await this.recordUrlClick(alias, clientInfo);
          return {
            originalUrl: cachedUrl.originalUrl,
            isPasswordProtected: false,
          };
        }

        return { originalUrl: null, isPasswordProtected: true };
      }

      // If not in cache, get from database
      const url = await this.urlRepository.findOne({
        where: { alias, status: UrlStatus.ACTIVE },
      });

      if (!url) {
        throw new NotFoundException(_404.URL_NOT_FOUND);
      }

      // Check if URL is expired
      const isExpired = url.expiresAt && new Date() > url.expiresAt;
      if (isExpired) {
        // Update status to expired
        url.status = UrlStatus.EXPIRED;
        await this.urlRepository.save(url);

        // Cache the expired status with TTL from config or default 24 hours
        const expiredCacheTtl = this.configService.get<number>("EXPIRED_URL_CACHE_TTL", 60 * 60 * 24);
        await this.cacheManager.set(
          cacheKey,
          { originalUrl: null, isPasswordProtected: false, isExpired: true },
          expiredCacheTtl
        );

        throw new NotFoundException(_404.EXPIRED_URL);
      }

      // Cache the result with TTL from config or default 1 hour
      const cacheTtl = this.configService.get<number>("URL_CACHE_TTL", 60 * 60);
      await this.cacheManager.set(
        cacheKey,
        {
          originalUrl: url.originalUrl,
          isPasswordProtected: url.isPasswordProtected,
          isExpired: false,
        },
        cacheTtl
      );

      // If not password protected, record click and return URL
      if (!url.isPasswordProtected) {
        await this.recordUrlClick(alias, clientInfo);
        return { originalUrl: url.originalUrl, isPasswordProtected: false };
      }

      // If password protected, return flag
      return { originalUrl: null, isPasswordProtected: true };
    } catch (error) {
      this.logger.error(
        `Redirect failed for alias ${alias}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Access a password-protected URL
   */
  async accessProtectedUrl(
    alias: string,
    data: AccessUrlDto,
    clientInfo: ClientInfo
  ): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { alias, status: UrlStatus.ACTIVE },
      select: ["id", "originalUrl", "password", "expiresAt"],
    });

    if (!url) {
      throw new NotFoundException(_404.URL_NOT_FOUND);
    }

    // Check if URL is expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      // Update status to expired
      url.status = UrlStatus.EXPIRED;
      await this.urlRepository.save(url);
      throw new NotFoundException(_404.EXPIRED_URL);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, url.password);
    if (!isPasswordValid) {
      throw new BadRequestException(_400.INCORRECT_PASSWORD);
    }

    // Record click and return original URL
    await this.recordUrlClick(alias, clientInfo);
    return url.originalUrl;
  }

  // ==================== ANALYTICS ====================

  /**
   * Get analytics for a URL - GET /analytics/:shortUrl
   */
  async getUrlAnalytics(
    alias: string,
    user: User,
    startDate?: Date,
    endDate?: Date
  ): Promise<UrlAnalyticsDto> {
    const url = await this.urlRepository.findOne({
      where: { alias },
    });

    if (!url) {
      throw new NotFoundException(_404.URL_NOT_FOUND);
    }

    // Check if user has access to this URL
    if (url.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(_403.URL_ACCESS_DENIED);
    }

    // Process device info and referrers from JSON data
    const deviceInfo = url.deviceInfo || {};
    const referrers = url.referrers || {};

    // Calculate browser and device distribution
    const browsers = this.calculatePercentages(deviceInfo.browsers || {});
    const devices = this.calculatePercentages(deviceInfo.devices || {});

    // Create simplified timeline data - last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const timeline = this.generateTimeline(
      thirtyDaysAgo,
      today,
      url.deviceInfo?.timeline || {}
    );

    return {
      totalClicks: url.clicks || 0,
      uniqueVisitors: deviceInfo.uniqueVisitors || 0,
      referrers,
      browsers,
      devices,
      timeline,
    };
  }

  /**
   * Record a click on a URL
   */
  private async recordUrlClick(
    alias: string,
    clientInfo: ClientInfo
  ): Promise<void> {
    try {
      // Get the URL first
      const url = await this.urlRepository.findOne({
        where: { alias },
      });

      if (!url) return;

      // Increment click count
      url.clicks += 1;
      url.lastClickedAt = new Date();

      // Update device info JSON
      if (!url.deviceInfo) url.deviceInfo = {};

      // Update browser stats
      if (!url.deviceInfo.browsers) url.deviceInfo.browsers = {};
      const browser = clientInfo.browser;
      url.deviceInfo.browsers[browser] =
        (url.deviceInfo.browsers[browser] || 0) + 1;

      // Update device type stats
      if (!url.deviceInfo.devices) url.deviceInfo.devices = {};
      const deviceType = clientInfo.deviceType;
      url.deviceInfo.devices[deviceType] =
        (url.deviceInfo.devices[deviceType] || 0) + 1;

      // Track unique visitors
      if (clientInfo.visitorId) {
        if (!url.deviceInfo.visitors) url.deviceInfo.visitors = [];
        if (!url.deviceInfo.visitors.includes(clientInfo.visitorId)) {
          url.deviceInfo.visitors.push(clientInfo.visitorId);
          url.deviceInfo.uniqueVisitors =
            (url.deviceInfo.uniqueVisitors || 0) + 1;
        }
      }

      // Update referrer stats
      if (!url.referrers) url.referrers = {};
      const referrer = this.parseReferrer(clientInfo.referrer);
      url.referrers[referrer] = (url.referrers[referrer] || 0) + 1;

      // Update timeline data
      const today = new Date().toISOString().split("T")[0];
      if (!url.deviceInfo.timeline) url.deviceInfo.timeline = {};
      url.deviceInfo.timeline[today] =
        (url.deviceInfo.timeline[today] || 0) + 1;

      // Save the updated URL
      await this.urlRepository.save(url);
    } catch (error) {
      // Log error but don't throw - we don't want to break the redirection
      console.error(
        `Failed to record URL click: ${error.message}`,
        error.stack,
        UrlsService.name
      );
    }
  }

  /**
   * Parse and normalize referrer URL
   */
  private parseReferrer(referrer: string): string {
    if (!referrer) return "Direct";

    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch (e) {
      return "Invalid";
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generate a unique URL alias
   */
  private async generateUniqueAlias(): Promise<string> {
    const aliasLength = this.configService.get<number>(
      "DEFAULT_SHORT_CODE_LENGTH",
      7
    );
    let alias: string;
    let isUnique = false;

    // Create a nanoid generator with custom alphabet
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const generateId = this.customAlphabet(alphabet, aliasLength);

    // Keep generating until we find a unique one
    while (!isUnique) {
      alias = generateId();
      const existing = await this.urlRepository.findOne({ where: { alias } });
      if (!existing) {
        isUnique = true;
      }
    }

    return alias;
  }

  /**
   * Hash a password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>(
      "PASSWORD_HASH_ROUNDS",
      10
    );
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Calculate percentages from counts
   */
  private calculatePercentages(
    counts: Record<string, number>
  ): Record<string, number> {
    const total =
      Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;

    const percentages: Record<string, number> = {};
    Object.entries(counts).forEach(([key, value]) => {
      percentages[key] = Math.round((value / total) * 100);
    });

    return percentages;
  }

  /**
   * Generate timeline data for analytics
   */
  private generateTimeline(
    startDate: Date,
    endDate: Date,
    existingData: Record<string, number> = {}
  ): { date: string; clicks: number }[] {
    const timeline: { date: string; clicks: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      timeline.push({
        date: dateString,
        clicks: existingData[dateString] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeline;
  }

  /**
   * Map URL entity to response DTO
   */
  private mapUrlToResponseDto(url: Url): UrlResponseDto {
    const baseUrl =
      url.customDomain ||
      this.configService.get<string>("APP_URL", "http://localhost:3000");

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      alias: url.alias,
      shortUrl: `${baseUrl}/${url.alias}`,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clicks: url.clicks,
      userId: url.userId,
      status: url.status,
      isPasswordProtected: url.isPasswordProtected,
    };
  }

  /**
   * Custom alphabet function to create a short ID generator
   */
  private customAlphabet(alphabet: string, size: number): () => string {
    return () => {
      let id = "";
      for (let i = 0; i < size; i++) {
        id += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return id;
    };
  }
}
