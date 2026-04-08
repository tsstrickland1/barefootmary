import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadAudio } from "@/lib/supabase/uploadAudio";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const description = formData.get("description");
  const audioRecording = formData.get("audio_recording");
  const audioFile = formData.get("audio");

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }

  // Prefer uploaded file over recorded blob
  const audioToUpload =
    audioFile instanceof File && audioFile.size > 0
      ? audioFile
      : audioRecording instanceof File && audioRecording.size > 0
        ? audioRecording
        : null;

  let filePath: string | null = null;
  if (audioToUpload) {
    try {
      filePath = await uploadAudio(audioToUpload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Audio upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("submissions").insert({
    name: name.trim(),
    email: typeof email === "string" && email.trim() ? email.trim() : null,
    description: description.trim(),
    file_path: filePath,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
