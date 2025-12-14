import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  usePublicClients,
  usePublicEmployees,
  usePublicProperties,
  usePublicNews,
} from "../hooks/usePublicData";
import { useAuth } from "../hooks/useAuth";
import { getTimeZoneInfo, formatDateForDisplay } from "../utils/timezone";
import type {
  PublicClient,
  PublicEmployee,
  PublicProperty,
  PublicNews,
} from "../api/public";
import Login from "./Login";
import "../styles/components.css";

const PublicView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "clients" | "employees" | "properties" | "news"
  >("clients");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Timezone info
  const timezoneInfo = getTimeZoneInfo();

  // Public data hooks
  const { data: clientsData, isLoading: clientsLoading } = usePublicClients({
    search,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const { data: employeesData, isLoading: employeesLoading } =
    usePublicEmployees({
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });

  const { data: propertiesData, isLoading: propertiesLoading } =
    usePublicProperties({
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });

  const { data: newsData, isLoading: newsLoading } = usePublicNews({
    search,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const totalPages =
    clientsData?.pagination?.pages ||
    employeesData?.pagination?.pages ||
    propertiesData?.pagination?.pages ||
    newsData?.pagination?.pages ||
    1;

  const isLoading =
    activeTab === "clients"
      ? clientsLoading
      : activeTab === "employees"
      ? employeesLoading
      : activeTab === "properties"
      ? propertiesLoading
      : newsLoading;

  const currentData =
    activeTab === "clients"
      ? Array.isArray(clientsData?.clients)
        ? clientsData.clients
        : []
      : activeTab === "employees"
      ? Array.isArray(employeesData?.employees)
        ? employeesData.employees
        : []
      : activeTab === "properties"
      ? Array.isArray(propertiesData?.properties)
        ? propertiesData.properties
        : []
      : Array.isArray(newsData?.news)
      ? newsData.news
      : [];

  const renderTable = () => {
    if (isLoading) return <div className="loading">Loading...</div>;
    if (!currentData || currentData.length === 0)
      return <div className="empty">No data found</div>;

    switch (activeTab) {
      case "clients":
        return (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Created (Local)</th>
                  <th>Created (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {(currentData as PublicClient[]).map((item: PublicClient) => {
                  const dates = formatDateForDisplay(item.createdAt);
                  return (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{dates.local}</td>
                      <td>{dates.utc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "employees":
        return (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created (Local)</th>
                  <th>Created (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {(currentData as PublicEmployee[]).map(
                  (item: PublicEmployee) => {
                    const dates = formatDateForDisplay(item.createdAt);
                    return (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.position}</td>
                        <td>{item.department}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.isActive ? "badge-success" : "badge-warning"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>{dates.local}</td>
                        <td>{dates.utc}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        );

      case "properties":
        return (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Created (Local)</th>
                  <th>Created (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {(currentData as PublicProperty[]).map(
                  (item: PublicProperty) => {
                    const dates = formatDateForDisplay(item.createdAt);
                    return (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>{item.type}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "available"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.location.city}, {item.location.country}
                        </td>
                        <td>{dates.local}</td>
                        <td>{dates.utc}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        );

      case "news":
        return (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Tags</th>
                  <th>Published (Local)</th>
                  <th>Published (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {(currentData as PublicNews[]).map((item: PublicNews) => {
                  const dates = formatDateForDisplay(
                    item.publishedAt || item.createdAt
                  );
                  return (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.author}</td>
                      <td>
                        {item.tags?.map((tag: string, index: number) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td>{dates.local}</td>
                      <td>{dates.utc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  if (isAuthenticated) {
    return (
      <div className="container">
        <div className="header">
          <h1>Already Logged In</h1>
          <p>
            You are already authenticated. Navigate to the dashboard to access
            CRUD features.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header with timezone info */}
      <div className="header">
        <div>
          <h1>Public Data View</h1>
          <p>Browse available data - Login to access full CRUD features</p>
        </div>
        <div className="timezone-info">
          <div className="timezone">Your Timezone: {timezoneInfo.timezone}</div>
          <div className="time">
            {timezoneInfo.currentTime} (UTC{timezoneInfo.offset})
          </div>
          <div className="time">UTC: {timezoneInfo.utcTime}</div>
        </div>
      </div>

      {/* Login button */}
      <div className="login-section">
        <Login />
      </div>

      {/* Tab navigation */}
      <div className="tabs">
        <div className="tab-list">
          {(["clients", "employees", "properties", "news"] as const).map(
            (tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="filters">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="select-input"
        >
          <option value="createdAt">Created Date</option>
          <option value="name">Name</option>
          <option value="title">Title</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as "asc" | "desc");
            setPage(1);
          }}
          className="select-input"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Data table */}
      <div className="mb-20">{renderTable()}</div>

      {/* Pagination */}
      {currentData && currentData.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn pagination btn"
          >
            Previous
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn pagination btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicView;
