import { Tooltip, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function AccTooltip({ message }) {
  return (
    <Tooltip
      content={
        <div className="w-80">
          <Typography color="white" className="font-medium">
            Account privileges{" "}
          </Typography>
          <Typography
            variant="small"
            color="white"
            className="font-normal opacity-80"
          >
            Admin or Editor privileges are required to {message}
          </Typography>
        </div>
      }
    >
      <InformationCircleIcon
        strokeWidth={2}
        className="text-blue-gray-500 w-5 h-5 cursor-pointer"
      />
    </Tooltip>
  );
}
