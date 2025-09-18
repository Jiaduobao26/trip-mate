import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import { Avatar, CircularProgress, Box } from "@mui/material";

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth(); // global AuthProvider
  const uid = user?.uid;

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for changes on /users/{uid}
  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setError(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    setError(null);

    const ref = doc(db, "users", uid);
    const un = onSnapshot(
      ref,
      (snap) => {
        setProfile(snap.exists() ? snap.data() : null);
        setProfileLoading(false);
      },
      (err) => {
        console.error("[SNAP ERROR]", err);
        setError(err);
        setProfileLoading(false);
      }
    );
    return () => un();
  }, [uid]);

  // Global user state is still resolving
  if (authLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} /> <span>Checking user…</span>
      </Box>
    );
  }

  // Not logged in
  if (!uid) return null;

  // Fetching profile
  if (profileLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} /> <span>Loading…</span>
      </Box>
    );
  }

  // Error (e.g. no permission)
  if (error) {
    return <span style={{ color: "#f44336" }}>Profile unavailable</span>;
  }

  // No document (new user not yet saved)
  if (!profile) {
    return <span>New user</span>;
  }

  // Normal render
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {profile.avatar ? (
        <Avatar alt="avatar" src={profile.avatar} sx={{ width: 32, height: 32 }} />
      ) : (
        <Avatar sx={{ width: 32, height: 32 }}>
          {(profile.name || profile.email || "U").slice(0, 1).toUpperCase()}
        </Avatar>
      )}
      <span>{profile.name || profile.email || uid}</span>
    </Box>
  );
}
