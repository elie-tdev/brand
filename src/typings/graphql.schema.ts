
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum ColorModeEnum {
    hex = "hex",
    hsl = "hsl",
    hsv = "hsv",
    hwb = "hwb",
    lab = "lab",
    rgb = "rgb",
    xyz = "xyz",
    cmyk = "cmyk"
}

export enum Status {
    waiting = "waiting",
    process = "process",
    finished = "finished"
}

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

export class LogoSpacingInput {
    isEditedByUser?: boolean;
    topPercentage?: number;
    bottomPercentage?: number;
    leftPercentage?: number;
    rightPercentage?: number;
    spacingMultiple?: number;
}

export class SignUpInput {
    firebaseUid: string;
    name: string;
    email: EmailAddress;
    isAgency?: boolean;
    agencyName?: string;
    policiesAgreed: boolean;
}

export class TenantInput {
    isAgency: string;
    subscriptionPlanSlug?: string;
}

export class TypographyInput {
    element?: string;
    color?: string;
    font?: string;
    fontFamily: string;
    fontSize?: string;
    fontVariant?: string;
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
    domainSlug?: string;
    brandName?: string;
    locale?: string;
    hadGuidelines?: string;
    isPublished?: boolean;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class BrandOnboardingStatus {
    colors: Status;
    logos: Status;
    typography: Status;
    templates: Status;
}

export class CmykObject {
    css?: string;
    cyan?: number;
    key?: number;
    yellow?: number;
    magenta?: number;
}

export class ColorPayload {
    _id: string;
    hex: string;
    hsl?: HslObject;
    hsv?: HsvObject;
    hwb?: HwbObject;
    lab?: LabObject;
    rgb?: RgbObject;
    xyz?: XyzObject;
    cmyk?: CmykObject;
    tags?: string[];
    title: string;
    selectedColorMode?: ColorModeEnum;
}

export class CoverArt {
    coverArtId: UUID;
    coverArtSlug: string;
    coverArtTitle: string;
}

export class DraftGuidelinePayload {
    guidelineObj: GuidelinePayload;
    coverArtSlug?: string;
}

export class EncodedLogoSize {
    width?: number;
    height?: number;
    aspectRatio?: string;
}

export class FromScratchResponsePayload {
    draftGuidelineId: UUID;
}

export class Guideline {
    typography?: TypographyPayload[];
}

export class GuidelinePayload {
    logos?: LogoPayload[];
    colors?: ColorPayload[];
    typography?: TypographyPayload[];
}

export class HslObject {
    css?: string;
    hue?: number;
    lightness?: number;
    saturation?: number;
}

export class HsvObject {
    css?: string;
    hue?: number;
    value?: number;
    saturation?: number;
}

export class HwbObject {
    css?: string;
    hue?: number;
    blackness?: number;
    whiteness?: number;
}

export class LabObject {
    css?: string;
    lightness?: number;
    a?: number;
    b?: number;
}

export class LogoData {
    logoId: UUID;
    brandId: UUID;
    original?: URL;
    encoded?: URL;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    archivedAt?: DateTime;
    deletedAt?: DateTime;
}

export class LogoPayload {
    _id: UUID;
    title?: string;
    tags?: string[];
    originalUrl: URL;
    encodedUrl: URL;
    encodedSize?: EncodedLogoSize;
    spacing?: LogoSpacing;
}

export class LogoSpacing {
    isEditedByUser?: boolean;
    topPercentage?: number;
    bottomPercentage?: number;
    leftPercentage?: number;
    rightPercentage?: number;
    spacingMultiple?: number;
}

export abstract class IMutation {
    abstract createBrand(values?: BrandInput): string | Promise<string>;

    abstract updateBrandOnboardingStatus(brandId: UUID, values: JSON): string | Promise<string>;

    abstract replaceColorObj(brandId: UUID, _id: UUID, colorsObj?: JSON): JSON | Promise<JSON>;

    abstract addColor(brandId: UUID, hex: string): Success | Promise<Success>;

    abstract updateSelectedColorMode(brandId: UUID, _id: UUID, selectedColorMode?: ColorModeEnum): Success | Promise<Success>;

    abstract login(email: string, password: string): AuthToken | Promise<AuthToken>;

    abstract signup(email: string, password: string): AuthToken | Promise<AuthToken>;

    abstract encodeLogo(imageFile: string, fileExt: string, brandId: UUID): LogoPayload | Promise<LogoPayload>;

    abstract replaceLogoSpacingObj(brandId: UUID, _id: UUID, spacing: LogoSpacingInput): Success | Promise<Success>;

    abstract replaceTitleTags(brandId: UUID, _id: UUID, title?: string, tags?: string[]): Success | Promise<Success>;

    abstract removeObjByObjId(brandId: UUID, _id: UUID): Success | Promise<Success>;

    abstract buildFromScratch(brandName: string, websiteUrl: URL, brandId: UUID): FromScratchResponsePayload | Promise<FromScratchResponsePayload>;

    abstract updateSelectedCoverMode(brandId: UUID, coverArtSlug: string): Success | Promise<Success>;

    abstract saveGuideline(brandId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract publishGuideline(brandId: UUID): Success | Promise<Success>;

    abstract deleteGuideline(guidelineId: UUID): Success | Promise<Success>;

    abstract changeGuidelinePublicState(guidelineId: UUID, isPublic: boolean): Success | Promise<Success>;

    abstract deleteDraftGuideline(guidelineId: UUID): Success | Promise<Success>;

    abstract scrapeThisUrl(brandName: string, websiteUrl: URL, brandId: UUID): ScrapeResponsePayload | Promise<ScrapeResponsePayload>;

    abstract signUpServer(values?: SignUpInput): SignUpPayload | Promise<SignUpPayload>;

    abstract replaceTypographyObj(brandId: UUID, _id: UUID, typographyObj: TypographyInput): Success | Promise<Success>;

    abstract addTypography(brandId: UUID, typographyObj: TypographyInput): Success | Promise<Success>;

    abstract createTenant(values?: TenantInput): string | Promise<string>;

    abstract createUser(values?: UserInput): string | Promise<string>;

    abstract updateUsersNameEmail(name: string, email: string): User | Promise<User>;
}

export class PoliciesPayload {
    version: string;
    timestamp: DateTime;
}

export class PublishedGuidelineData {
    guidelineId: UUID;
    brandId: UUID;
    scrapeId?: UUID;
    guidelineObj: GuidelinePayload;
    isPublic: boolean;
    coverArtSlug: string;
    domainSlug?: string;
    updatedAt?: DateTime;
}

export abstract class IQuery {
    abstract listBrands(): Brand[] | Promise<Brand[]>;

    abstract getBrandOnboardingStatus(brandId: UUID): BrandOnboardingStatus | Promise<BrandOnboardingStatus>;

    abstract colorsByBrandId(brandId: UUID): ColorPayload[] | Promise<ColorPayload[]>;

    abstract logosByBrandId(brandId: UUID): LogoPayload[] | Promise<LogoPayload[]>;

    abstract logoByObjId(brandId: UUID, _id: UUID): LogoPayload | Promise<LogoPayload>;

    abstract listCoverArt(): CoverArt[] | Promise<CoverArt[]>;

    abstract getTitleTags(brandId: UUID, _id: UUID): TitleTags | Promise<TitleTags>;

    abstract guidelinesByBrandId(brandId: UUID, isPublic: boolean): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract guidelineByGuidelineId(guidelineId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract guidelineByWebsiteUrl(websiteUrl: URL): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract guidelineByDomainSlug(domainSlug: string): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract getGuidelineLastUpdateDate(guidelineId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract getColorsByGuidelineId(guidelineId: UUID): ColorPayload[] | Promise<ColorPayload[]>;

    abstract getLogosByGuidelineId(guidelineId: UUID): LogoPayload[] | Promise<LogoPayload[]>;

    abstract getTypographyByGuidelineId(guidelineId: UUID): TypographyPayload[] | Promise<TypographyPayload[]>;

    abstract getGuidelinePublicStatus(websiteUrl: URL): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract getGuidelinePublicStatusByDomainSlug(domainSlug: string): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract viewDraftGuideline(): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract draftGuidelinesByBrandId(brandId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract draftGuidelineByGuidelineId(guidelineId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract draftGuidelineByWebsiteUrl(websiteUrl: URL): DraftGuidelinePayload | Promise<DraftGuidelinePayload>;

    abstract draftGuidelineByDomainSlug(domainSlug: string): DraftGuidelinePayload | Promise<DraftGuidelinePayload>;

    abstract getDraftGuidelineLastUpdateDate(guidelineId: UUID): PublishedGuidelineData | Promise<PublishedGuidelineData>;

    abstract getDraftTypographyByGuidelineId(guidelineId: UUID): TypographyPayload[] | Promise<TypographyPayload[]>;

    abstract getDraftLogosByGuidelineId(guidelineId: UUID): LogoPayload[] | Promise<LogoPayload[]>;

    abstract getDraftColorsByGuidelineId(guidelineId: UUID): ColorPayload[] | Promise<ColorPayload[]>;

    abstract scrapesByBrandId(brandId: UUID): ScrapedData[] | Promise<ScrapedData[]>;

    abstract typographyByBrandId(brandId: UUID): TypographyPayload[] | Promise<TypographyPayload[]>;

    abstract fetchTypographySource(brandId: UUID, _id: UUID): TypographyPayload | Promise<TypographyPayload>;

    abstract findFont(brandId: UUID, fontFamily: string, _id?: UUID): boolean | Promise<boolean>;

    abstract tenantList(): Tenant[] | Promise<Tenant[]>;

    abstract userList(): User[] | Promise<User[]>;

    abstract userClientCtx(): UserClientCtx | Promise<UserClientCtx>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class RgbObject {
    css?: string;
    red?: number;
    blue?: number;
    green?: number;
}

export class ScrapedData {
    scrapeId: UUID;
    brandId: UUID;
    scrapedObj?: JSON;
}

export class ScrapeResponsePayload {
    draftGuidelineId: UUID;
    logo?: LogoPayload;
}

export class SignUpPayload {
    brandId: string;
}

export class Success {
    success: boolean;
}

export class Tenant {
    tenantId: UUID;
    subscriptionPlanSlug: string;
    isAgency: boolean;
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
    subscriptionPeriodEnds: DateTime;
    chargebeeSubscriptionId: string;
    chargebeeCustomerId: string;
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

export class TitleTags {
    _id: UUID;
    title?: string;
    tags?: string[];
}

export class TypographyPayload {
    _id: UUID;
    title?: string;
    tags?: string[];
    element?: string;
    color?: string;
    font?: string;
    fontFamily: string;
    fontSize?: string;
    fontVariant?: string;
    source?: TypographySourcePayload;
}

export class TypographySourcePayload {
    ref?: string;
    provider?: string;
    variants?: string[];
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
    subscriptionPeriodEnds?: PositiveInt;
    tenantBrandRoleSlug: TenantBrandRoleSlugs;
}

export class UserClientCtx {
    name: string;
    firebaseUid: string;
    userId: string;
    email: EmailAddress;
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

export class XyzObject {
    css?: string;
    x?: number;
    y?: number;
    z?: number;
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
