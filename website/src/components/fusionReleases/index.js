import React, { useState, useMemo } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./styles.module.css";

const CHANNEL_LABELS = {
  dev: "Dev",
  canary: "Canary",
  latest: "Latest",
  "st-monday": "ST Monday",
  "st-wednesday": "ST Wednesday",
  "st-thursday": "ST Thursday",
};

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function compareVersions(a, b) {
  const parseVersion = (v) => {
    const match = v.match(
      /v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z]+)\.?(\d+)?)?/
    );
    if (!match) return [0, 0, 0, "", 0];
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] || "",
      parseInt(match[5] || "0", 10),
    ];
  };

  const pa = parseVersion(a);
  const pb = parseVersion(b);

  for (let i = 0; i < pa.length; i++) {
    if (pa[i] < pb[i]) return 1;
    if (pa[i] > pb[i]) return -1;
  }
  return 0;
}

function VersionCards({ versions }) {
  if (!versions) return null;

  const channels = Object.entries(versions);
  if (channels.length === 0) return null;

  return (
    <div>
      <h3>Current versions</h3>
      <div className={styles.versionsGrid}>
        {channels.map(([channel, info]) => (
          <div key={channel} className={styles.versionCard}>
            <h4>{CHANNEL_LABELS[channel] || channel}</h4>
            <code>{info.tag}</code>
            <span className={styles.versionDate}>{info.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReleaseItem({ version, data }) {
  const channels = data.released ? Object.keys(data.released) : [];

  const latestRelease = channels.reduce((latest, ch) => {
    const entry = data.released[ch];
    if (!latest || entry.timestamp > latest.timestamp) {
      return { ...entry, channel: ch };
    }
    return latest;
  }, null);

  const reason =
    latestRelease?.reason &&
    (typeof latestRelease.reason === "string"
      ? latestRelease.reason
      : JSON.stringify(latestRelease.reason));

  return (
    <div className={styles.releaseItem}>
      <div className={styles.releaseHeader}>
        <span className={styles.versionTag}>{version}</span>
        {data.known_bad ? (
          <span className={styles.badgeBad}>Known Bad</span>
        ) : (
          <span className={styles.badgeGood}>Good</span>
        )}
        {channels.map((ch) => (
          <span key={ch} className={styles.channelBadge}>
            {CHANNEL_LABELS[ch] || ch}
          </span>
        ))}
      </div>
      <div className={styles.releaseDetails}>
        {latestRelease?.released_by && (
          <span className={styles.releaseDetail}>
            Released by: <strong>{latestRelease.released_by}</strong>
          </span>
        )}
        {latestRelease?.timestamp && (
          <span className={styles.releaseDetail}>
            {formatTimestamp(latestRelease.timestamp)}
          </span>
        )}
      </div>
      {reason && <div className={styles.releaseReason}>{reason}</div>}
    </div>
  );
}

export default function FusionReleases() {
  const { releases, versions } = usePluginData(
    "docusaurus-build-fusion-releases-plugin"
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  const sortedReleases = useMemo(() => {
    if (!releases) return [];
    return Object.entries(releases).sort(([a], [b]) => compareVersions(a, b));
  }, [releases]);

  const allChannels = useMemo(() => {
    if (!releases) return [];
    const channels = new Set();
    Object.values(releases).forEach((data) => {
      if (data.released) {
        Object.keys(data.released).forEach((ch) => channels.add(ch));
      }
    });
    return Array.from(channels).sort();
  }, [releases]);

  const filteredReleases = useMemo(() => {
    return sortedReleases.filter(([version, data]) => {
      if (search && !version.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter === "good" && data.known_bad) return false;
      if (statusFilter === "bad" && !data.known_bad) return false;
      if (
        channelFilter !== "all" &&
        (!data.released || !data.released[channelFilter])
      ) {
        return false;
      }
      return true;
    });
  }, [sortedReleases, search, statusFilter, channelFilter]);

  if (!releases || !versions || Object.keys(releases).length === 0) {
    return (
      <div className={styles.error}>
        Release data is not available. Please try rebuilding the site.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <VersionCards versions={versions} />

      <h3>All releases</h3>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search versions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filterGroup}>
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="good">Good</option>
            <option value="bad">Known Bad</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="channel-filter">Channel:</label>
          <select
            id="channel-filter"
            className={styles.filterSelect}
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="all">All</option>
            {allChannels.map((ch) => (
              <option key={ch} value={ch}>
                {CHANNEL_LABELS[ch] || ch}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultCount}>
        Showing {filteredReleases.length} of {sortedReleases.length} releases
      </div>

      <div className={styles.releaseList}>
        {filteredReleases.length === 0 ? (
          <div className={styles.noResults}>
            No releases match your filters.
          </div>
        ) : (
          filteredReleases.map(([version, data]) => (
            <ReleaseItem key={version} version={version} data={data} />
          ))
        )}
      </div>
    </div>
  );
}
