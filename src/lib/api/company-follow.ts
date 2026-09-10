/**
 * Quản lý theo dõi công ty (Follow Company) cho ứng viên
 * Dữ liệu lưu trữ bền vững theo userId của ứng viên
 */

export interface FollowedCompany {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  location?: string;
  followedAt?: string;
}

const STORAGE_PREFIX = "jobportal_followed_companies_";

function getStorageKey(userId?: string): string {
  return `${STORAGE_PREFIX}${userId || "guest"}`;
}

export function getFollowedCompanies(userId?: string): FollowedCompany[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error("Error reading followed companies:", error);
  }
  return [];
}

export function isCompanyFollowed(companyId: string, userId?: string): boolean {
  if (!companyId || typeof window === "undefined") return false;
  const list = getFollowedCompanies(userId);
  return list.some((c) => String(c.id) === String(companyId));
}

export function toggleFollowCompany(
  company: FollowedCompany,
  userId?: string
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = getStorageKey(userId);
    const list = getFollowedCompanies(userId);
    const index = list.findIndex((c) => String(c.id) === String(company.id));

    let isNowFollowed = false;
    if (index >= 0) {
      // Unfollow
      list.splice(index, 1);
      isNowFollowed = false;
    } else {
      // Follow
      list.unshift({
        ...company,
        followedAt: new Date().toISOString(),
      });
      isNowFollowed = true;
    }

    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("company_follow_changed", { detail: { companyId: company.id, isFollowed: isNowFollowed } }));
    return isNowFollowed;
  } catch (error) {
    console.error("Error toggling followed company:", error);
    return false;
  }
}
