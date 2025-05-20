import { CommentLead, PostLead } from '@/types/backend/db';

export function isPostLead(lead: CommentLead | PostLead) {
    // Only posts have titles. Comments do not
    return `title` in lead;
}

export function timeAgo(unixTimestamp: number) {
    // Returns how long ago a certain date in unix occurred
    if (unixTimestamp < 1e12) {
        unixTimestamp *= 1000;
    }

    const now = Date.now();
    const diff = now - unixTimestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 5) {
        return 'just now';
    } else if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (months < 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}
