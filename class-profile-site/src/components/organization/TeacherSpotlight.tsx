"use client";

import { motion } from "framer-motion";
import { ORGANIZATION } from "@/lib/constants";
import { MemberCard } from "@/components/organization/MemberCard";

export function TeacherSpotlight() {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="index-label"
      >
        00 — At the Head of the Room
      </motion.span>
      <div className="w-full max-w-xs sm:max-w-sm">
        <MemberCard member={ORGANIZATION.teacher} size="lg" />
      </div>
    </div>
  );
}
