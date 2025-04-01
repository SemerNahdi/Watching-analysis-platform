import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const supabase = createClient(cookies());

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate the request body
        const body = await request.json();
        const { videoId, currentTime, duration } = body;

        if (!videoId || typeof currentTime !== "number" || typeof duration !== "number") {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        // Save the video tracking data
        const { error: trackingError } = await supabase
            .from("video_tracking")
            .insert([
                {
                    user_id: user.id,
                    video_id: videoId,
                    current_time: currentTime,
                    duration: duration,
                    watched_percentage: (currentTime / duration) * 100,
                },
            ]);

        if (trackingError) {
            console.error("Error saving video tracking:", trackingError);
            return NextResponse.json(
                { error: "Failed to save tracking data" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Video tracking error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 