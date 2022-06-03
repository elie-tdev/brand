
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum TenantBrandRoleSlugs {
    owner = "owner",
    agent = "agent"
}

export enum UserTenantRoleSlugs {
    admin = "admin",
    editor = "editor",
    user = "user"
}

export class BrandInput {
    websiteURL: URL;
    locale?: string;
    hadGuidelines?: string;
    isPublished?: boolean;
}

export class SignUpInput {
    firebaseUid: string;
    name: string;
    email: EmailAddress;
    websiteUrl: URL;
    hadGuidelines: string;
    isAgency?: boolean;
    policiesAgreed: boolean;
}

export class TenantInput {
    isAgency: string;
    subscriptionPlanSlug?: string;
}

export class UserInput {
    firebaseUid: string;
    name: string;
    email: EmailAddress;
    policiesAgreed?: boolean;
}

export class AuthToken {
    token?: JWT;
}

export class Brand {
    brandId: UUID;
    websiteUrl: URL;
    locale?: string;
    hadGuidelines?: string;
    isPublished?: boolean;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class LogoData {
    logoId: UUID;
    brandId: UUID;
    logoUrl: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export abstract class IMutation {
    abstract createBrand(values?: BrandInput): string | Promise<string>;

    abstract login(email: string, password: string): AuthToken | Promise<AuthToken>;

    abstract signup(email: string, password: string): AuthToken | Promise<AuthToken>;

    abstract scrapeLogo(websiteUrl: URL, brandId: UUID): string | Promise<string>;

    abstract encodeLogo(imageFile: string, brandId: UUID): string | Promise<string>;

    abstract scrapeThisUrl(websiteUrl: URL, brandId: UUID): JSON | Promise<JSON>;

    abstract signUpServer(values?: SignUpInput): UserCtx | Promise<UserCtx>;

    abstract createTenant(values?: TenantInput): string | Promise<string>;

    abstract createUser(values?: UserInput): string | Promise<string>;

    abstract updateUsersNameEmail(name: string, email: string): User | Promise<User>;
}

export class PoliciesPayload {
    version: string;
    timestamp: DateTime;
}

export abstract class IQuery {
    abstract brandList(): Brand[] | Promise<Brand[]>;

    abstract logoList(): LogoData[] | Promise<LogoData[]>;

    abstract scrapeByBrandId(brandId: UUID): ScrapedData[] | Promise<ScrapedData[]>;

    abstract tenantList(): Tenant[] | Promise<Tenant[]>;

    abstract userList(): User[] | Promise<User[]>;

    abstract getUserContextByFirebaseUid(firebaseUid: string): UserCtx | Promise<UserCtx>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class ScrapedData {
    scraperId: UUID;
    brandId: UUID;
    scrapedObj?: JSON;
}

export class SignUp {
    user?: User;
    tenant?: Tenant;
}

export class Tenant {
    tenantId: UUID;
    subscriptionPlanSlug: string;
    isAgency: boolean;
    subscriptionPeriodEnds: DateTime;
    chargebeeSubscriptionId: string;
    chargebeeCustomerId: string;
    adminReviewStatus: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class TenantBrandRoles {
    tenantBrandRoleSlug: TenantBrandRoleSlugs;
    displayName: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class TenantBrands {
    tenantId: UUID;
    brandId: UUID;
    tenantBrandRoleSlug: TenantBrandRoleSlugs[];
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class TenantUsers {
    tenantId: UUID;
    userId: UUID;
    userTenantRoleSlug: UserTenantRoleSlugs[];
    inviteHash?: string;
    inviteStatus?: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class User {
    userId: UUID;
    firebaseUid: string;
    name: string;
    email: EmailAddress;
    policiesAgreed?: boolean;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class UserBrands {
    brandId: string;
    chargebeeSubscriptionId?: string;
    subscriptionPeriodEnds?: PositiveInt;
    tenantBrandRoleSlug: TenantBrandRoleSlugs;
}

export class UserCtx {
    name: string;
    userId: string;
    tenantId: string;
    userTenantRoleSlug: UserTenantRoleSlugs;
    brands?: UserBrands[];
}

export class UserNameEmail {
    name: string;
    email: string;
}

export class UserTenantRoles {
    userTenantRoleSlug?: UserTenantRoleSlugs;
    displayName?: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class Void {
    null?: boolean;
}

export type Date = any;
export type DateTime = any;
export type EmailAddress = any;
export type JSON = any;
export type JWT = any;
export type NegativeFloat = any;
export type NegativeInt = any;
export type NonNegativeFloat = any;
export type NonNegativeInt = any;
export type NonPositiveFloat = any;
export type NonPositiveInt = any;
export type PhoneNumber = any;
export type PositiveFloat = any;
export type PositiveInt = any;
export type PostalCode = any;
export type RegularExpression = any;
export type Time = any;
export type UnsignedFloat = any;
export type UnsignedInt = any;
export type URL = any;
export type UUID = any;
