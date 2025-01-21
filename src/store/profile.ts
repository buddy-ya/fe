import UserRepository from "@/api/UserRepository";
import { type CountryID } from "@/utils";
import { create } from "zustand";

type Gender = 'male' | 'female' | 'unknown' | null;

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

const defaultProfile: Profile = {
  name: "",
  university: "",
  country: "ko",
  gender: null,
  profileImageUrl: "",
  majors: [],
  languages: [],
  interests: [],
};

interface ProfileStore {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: defaultProfile,
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    const profileData = await UserRepository.get();
    set({ profile: profileData });
  },
}));
