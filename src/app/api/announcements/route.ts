import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ApiResponse, PaginatedData } from "@/types/api";
import { Announcement } from "@/types/announcement";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const visibility = searchParams.get("visibility"); 
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("announcements")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (visibility === "public") {
      query = query.eq("is_public", true);
    } else if (visibility === "private") {
      query = query.eq("is_public", false);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json<ApiResponse<PaginatedData<Announcement>>>({
      success: true,
      message: "Data fetched successfully",
      data: {
        items: data as Announcement[],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const is_public = formData.get("is_public") === "true";
    
    const imageFile = formData.get("image") as File;
    const bannerFile = formData.get("banner") as File;
    const videoFile = formData.get("video") as File;

    if (!title || !content) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    let image_url = null;
    let banner_url = null;
    let video_url = null;

    if (imageFile && imageFile.size > 0) {
      const upload = await uploadToCloudinary(imageFile, "announcements/images");
      image_url = upload.url;
    }

    if (bannerFile && bannerFile.size > 0) {
      const upload = await uploadToCloudinary(bannerFile, "announcements/banners");
      banner_url = upload.url;
    }

    if (videoFile && videoFile.size > 0) {
      const upload = await uploadToCloudinary(videoFile, "announcements/videos");
      video_url = upload.url;
    }

    const { data, error } = await supabaseAdmin
      .from("announcements")
      .insert({
        title,
        content,
        is_public,
        image_url,
        banner_url,
        video_url
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse<Announcement>>({
      success: true,
      message: "Announcement created successfully",
      data: data as Announcement
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}