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
      <div className="flex flex-col items-center w-8 mr-1">
        <div className="w-[1px] h-5 bg-gray-200"></div>
        <div className="bg-slate-300 rounded-full p-1">
          <Image
            width={16}
            height={16}
            src={activity.staffAvatar ?? "/ic_user.svg"}
            alt="activity image"
          />
        </div>
        <div className="w-[1px] h-full bg-gray-200"></div>
      </div>
      <div className="flex-1 my-3">
        <p className="text-sm mb-1">
          <a href="#" className="font-semibold">{activity.staffName}{" "}</a><span className="text-blue-500">{activity.description}</span>
        </p>
        <p className="text-xs text-gray-500">{activity.createdDate}</p>
      </div>
    </div>
  );
};

export default RecentActivityItem;
