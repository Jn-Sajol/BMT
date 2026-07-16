"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionCode = void 0;
var PermissionCode;
(function (PermissionCode) {
    // Facebook module
    PermissionCode["FACEBOOK_PAGE_READ"] = "facebook.page.read";
    PermissionCode["FACEBOOK_PAGE_WRITE"] = "facebook.page.write";
    PermissionCode["FACEBOOK_ADS_MANAGE"] = "facebook.ads.manage";
    // Campaign module
    PermissionCode["CAMPAIGN_CREATE"] = "campaign.create";
    PermissionCode["CAMPAIGN_READ"] = "campaign.read";
    PermissionCode["CAMPAIGN_UPDATE"] = "campaign.update";
    PermissionCode["CAMPAIGN_DELETE"] = "campaign.delete";
    // Workspace members module
    PermissionCode["WORKSPACE_MEMBER_INVITE"] = "workspace.member.invite";
    PermissionCode["WORKSPACE_MEMBER_REMOVE"] = "workspace.member.remove";
    PermissionCode["WORKSPACE_MEMBER_UPDATE"] = "workspace.member.update";
    // Organization members module
    PermissionCode["ORGANIZATION_MEMBER_INVITE"] = "organization.member.invite";
    PermissionCode["ORGANIZATION_MEMBER_REMOVE"] = "organization.member.remove";
    PermissionCode["ORGANIZATION_MEMBER_UPDATE"] = "organization.member.update";
    // Browser automation module
    PermissionCode["BROWSER_SESSION_CREATE"] = "browser.session.create";
    PermissionCode["BROWSER_SESSION_READ"] = "browser.session.read";
    PermissionCode["BROWSER_SESSION_DELETE"] = "browser.session.delete";
    // Workspace settings
    PermissionCode["WORKSPACE_SETTINGS_UPDATE"] = "workspace.settings.update";
    PermissionCode["WORKSPACE_DELETE"] = "workspace.delete";
    // Organization settings
    PermissionCode["ORGANIZATION_SETTINGS_UPDATE"] = "organization.settings.update";
    PermissionCode["ORGANIZATION_DELETE"] = "organization.delete";
    PermissionCode["ORGANIZATION_BILLING_MANAGE"] = "organization.billing.manage";
})(PermissionCode || (exports.PermissionCode = PermissionCode = {}));
//# sourceMappingURL=permission.code.js.map