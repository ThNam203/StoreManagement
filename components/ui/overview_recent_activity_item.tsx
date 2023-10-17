import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

type ActivityModel = {
  id: number;
  imageUrl: string;
  staff: string;
  actionDetail: string;
  target: string;
  createdAt: string;
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
            src={"/ic_invoice.svg"}
            alt="activity image"
          />
        </div>
        <div className="w-[1px] h-full bg-gray-200"></div>
      </div>
      <div className="flex-1 my-3">
        <p className="text-sm mb-1">
          <a href="#" className="text-blue-600">{activity.staff}</a>{" " + activity.actionDetail + " "}<a href="#" className="text-blue-600">{activity.target}</a>
        </p>
        <p className="text-xs text-gray-500">{activity.createdAt}</p>
      </div>
    </div>
  );
};

export default RecentActivityItem;
