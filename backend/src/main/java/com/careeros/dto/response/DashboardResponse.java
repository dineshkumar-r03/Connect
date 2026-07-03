package com.careeros.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalBlogs;
    private long publishedBlogs;
    private long draftBlogs;
    private long totalViews;
    private long totalLikes;
    private long totalComments;
    private long followersCount;
    private long followingCount;
    private long bookmarksCount;
    private List<BlogResponse> recentBlogs;
    private List<BlogResponse> topBlogs;
    private List<UserResponse> recentFollowers;
}