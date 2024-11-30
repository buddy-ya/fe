import { getProfile } from "@/api/mypage/mypage";
import { type CountryID } from "@/utils/constants/countries";
import { create } from "zustand";

type Gender = "male" | "female" | "unknown";

interface Profile {
  name: string;
  university: string;
  country: CountryID;
  gender: Gender;
  profileImageUrl: string;
  majors: string[];
  languages: string[];
  interests: string[];
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    const profileData = await getProfile();
    set({ profile: profileData });
  },
}));
