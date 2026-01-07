import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabaseAdmin
      .from("announcements")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Detail fetched successfully",
      data
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const updates: any = {};

    const title = formData.get("title");
    if (title) updates.title = title;

    const content = formData.get("content");
    if (content) updates.content = content;

    if (formData.has("is_public")) updates.is_public = formData.get("is_public") === "true";

    const imageFile = formData.get("image") as File;
    const bannerFile = formData.get("banner") as File;
    const videoFile = formData.get("video") as File;

    if (imageFile && imageFile.size > 0) {
      const upload = await uploadToCloudinary(imageFile, "announcements/images");
      updates.image_url = upload.url;
    }

    if (bannerFile && bannerFile.size > 0) {
      const upload = await uploadToCloudinary(bannerFile, "announcements/banners");
      updates.banner_url = upload.url;
    }

    if (videoFile && videoFile.size > 0) {
      const upload = await uploadToCloudinary(videoFile, "announcements/videos");
      updates.video_url = upload.url;
    }

    const { data, error } = await supabaseAdmin
      .from("announcements")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Announcement updated successfully",
      data
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin
      .from("announcements")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Announcement deleted successfully"
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}