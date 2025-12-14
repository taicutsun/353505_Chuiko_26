import React from "react";
import { useNews, useDeleteNews } from "../hooks/useNews";
import type { News } from "../api/news";

const NewsList: React.FC = () => {
  const { data, isLoading, error } = useNews();
  const deleteNews = useDeleteNews();

  // Ensure we always have an array, even if data is undefined or not an array
  const news = Array.isArray(data) ? data : [];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      deleteNews.mutate(id);
    }
  };

  if (isLoading) return <div>Loading news...</div>;
  if (error) return <div>Error loading news</div>;

  return (
    <div>
      <h2>News</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}
      >
        {news?.map((newsItem: News) => (
          <div
            key={newsItem._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{newsItem.title}</h3>
            <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
              {newsItem.summary}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Category:</strong> {newsItem.category}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Author:</strong> {newsItem.author}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span
                  style={{
                    backgroundColor: newsItem.isPublished
                      ? "#4CAF50"
                      : "#9e9e9e",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {newsItem.isPublished ? "Published" : "Draft"}
                </span>
                {newsItem.publishedAt && (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(newsItem.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(newsItem._id)}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
            {newsItem.tags.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                {newsItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#e0e0e0",
                      color: "#333",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      marginRight: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
