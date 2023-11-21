import { cn } from "@/lib/utils";
import style from "./loading_circle_style.module.css";

const LoadingCircle = ({className}: {className?: string}) => (
    <div className={cn(style["profile-main-loader"], "!w-4 ml-4", className)}>
      <div className={style["loader"]}>
        <svg className={style["circular-loader"]} viewBox="25 25 50 50">
          <circle
            className={style["loader-path"]}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#70c542"
            strokeWidth="5"
          />
        </svg>
      </div>
    </div>
);

export default LoadingCircle;
