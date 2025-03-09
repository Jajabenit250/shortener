export enum AppEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
  TEST = 'test',
}

/**
 * Enumeration representing different authentication providers for OAuth.
 *
 * @remarks
 * This enumeration defines the external authentication providers
 * that can be used for user authentication.
 */
export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
}

/**
 * Enumeration representing the status of a user account in the system.
 *
 * @remarks
 * This enumeration defines the different states a user account can be in,
 * affecting authentication and system access.
 */
export enum CommonUserStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

/**
 * Enumeration representing the different roles a user can have in the system.
 *
 * @remarks
 * This enumeration defines the authorization levels and permissions
 * granted to different types of users within the application.
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ANALYTICS = 'analytics',
  SUPPORT = 'support',
  GUEST = 'guest',
}
