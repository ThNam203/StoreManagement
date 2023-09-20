import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";

/* 
    notification title = firstSubject + actionDetail + secondSubject
    example: Nam + asked to join + the second shift
*/
type NotiData = {
  imageUrl?: string | undefined; // if null, shop icon will be used
  firstSubject?: string | undefined;
  actionDetail?: string;
  secondSubject?: string | undefined;
  createdAt?: string;
  badges?: string[]; // Inventory, Event, ...
  isRead?: boolean;
};

const Notification: React.FC<NotiData> = (data) => {
  return (
    <div className="flex flex-row gap-2 p-2 border-gray-200">
      <Avatar>
        <AvatarImage
          src={data.imageUrl != null ? data.imageUrl : "/static/web_avatar.png"}
          width={32}
          height={32}
        />
        <AvatarFallback>
          {data.firstSubject != null && data.firstSubject.length > 0
            ? data.firstSubject[0]
            : "Shop"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm">
          <span className="font-semibold">{data.firstSubject}</span>{" "}
          {data.actionDetail}{" "}
          <span className="font-semibold">Ease Design System</span>
        </p>
        <p
          className={cn(
            "text-[0.7rem] text-gray-400",
            !data.isRead ? "text-blue-500 font-bold" : ""
          )}
        >
          {data.createdAt}
          {!data.isRead ? (<span className="w-2 h-2 bg-blue-500 rounded-full ml-2 inline-block"/>) : null}
        </p>
        <div>
          <Badge>UI Design</Badge>
          <Badge className="bg-yellow-700">Inventory</Badge>
          <Badge>Serving</Badge>
        </div>
      </div>
    </div>
  );
};

export default Notification;
