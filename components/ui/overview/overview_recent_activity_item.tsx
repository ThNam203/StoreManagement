import Image from "next/image";

type ActivityModel = {
  id: number;
  staffId: number;
  staffName: string;
  staffAvatar: string | null;
  description: string;
  createdDate: string;
};

const RecentActivityItem: React.FC<ActivityModel> = (activity) => {
  return (
    <div className="flex flex-row">
      <div className="mr-1 flex w-8 flex-col items-center">
        <div className="h-4 w-[1px] bg-gray-200"></div>
        <div className="!h-6 w-6 overflow-hidden rounded-full bg-blue-300 p-[1px]">
          <img
            src={activity.staffAvatar ?? "/ic_user.svg"}
            alt="activity image"
          />
        </div>
        <div className="flex-1 w-[1px] bg-gray-200"></div>
      </div>
      <div className="my-3 flex-1">
        <p className="mb-1 text-sm">
          <a href="#" className="font-semibold">
            {activity.staffName}{" "}
          </a>
          <span className="text-blue-500">{activity.description}</span>
        </p>
        <p className="text-xs text-gray-500">{activity.createdDate}</p>
      </div>
    </div>
  );
};

export default RecentActivityItem;
