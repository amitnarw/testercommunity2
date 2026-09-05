"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { useUserProfileData } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { TransitionLink } from "@/components/transition-link";
import { ProfileBentoGrid } from "@/components/profile-bento-grid";
import { ActiveSessions } from "@/components/authenticated/profile/active-sessions";
import { UserDataForm } from "@/components/authenticated/profile/user-data-form";
import { EliteBadgeSection } from "@/components/profile/elite-badge-section";

export default function ProfilePage() {
  return (
    <div
      data-loc="ProfilePage"
      className="mx-auto pb-12 max-w-4xl px-4 md:px-6"
    >
      <PageHeader
        title="Profile"
        backHref={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}
        className="w-1/2 lg:w-full !py-2"
      />
      <div className="mx-auto space-y-12 mt-5">
        <UserDataForm title="User Data" />

        {/* S10: Elite Badge moved here from the removed standalone page */}
        <EliteBadgeSection />

        <ActiveSessions />

        <ProfileBentoGrid />
      </div>
    </div>
  );
}
