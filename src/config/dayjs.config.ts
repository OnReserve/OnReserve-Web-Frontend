import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const formatDateForUserEvent = (date: string) => {
	return dayjs(date).format("MMM DD, YYYY");
};

export const getFromNow = (date: string) => {
	dayjs.extend(relativeTime);
	return dayjs(date).fromNow();
};
