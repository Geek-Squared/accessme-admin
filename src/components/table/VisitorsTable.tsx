import useFetchVisitors from "../../hooks/useFetchVisitors";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker styles
import "./styles.scss";
import Table from "../table/Table";
import useFetchUsers from "../../hooks/useFetchUsers";

const VisitorsTable = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();
  const { personnel } = useFetchPersonnel();
  const { users } = useFetchUsers();
  const { siteId } = useParams<{ siteId: string }>();

  console.log("siteId", siteId);

  const tableRef = useRef<HTMLDivElement>(null);

  // State for date filtering
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(visitors)) {
    return <p>No visitors available.</p>;
  }


  const formatDate = (timestamp: string | number) => {
    const date =
      typeof timestamp === "number"
        ? new Date(Math.floor(timestamp))
        : new Date(timestamp); // Handle both numeric and ISO 8601 formats
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to download the filtered visitors' data as CSV
  const downloadFilteredCSV = (filteredData: any[]) => {
    const headers = [
      "Visitor",
      "Phone Number",
      "ID Number",
      "Visiting",
      "Date",
      "Time In",
      "Time Out",
      "Personnel On Duty",
    ];

    const rows = filteredData?.map((visitor: any) => {
      const personnelOnDuty = personnel?.filter((person: any) =>
        visitor.security_personnel.includes(person._id)
      );

      return [
        visitor?.name,
        visitor?.phone,
        visitor?.idNumber,
        visitor?.visiting,
        formatDate(visitor?.createdAt),
        formatTime(visitor?.entryTime),
        visitor?.exitTime ? formatTime(visitor?.exitTime) : "Still on-site",
        personnelOnDuty,
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `visitors_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter visitors based on siteId and date range
  const filteredVisitors = visitors
    ?.filter((visitor: any) => visitor.siteId === siteId)
    ?.filter((visitor: any) => {
      if (!startDate || !endDate) return true;
      const visitorDate = new Date(visitor?.createdAt);
      return visitorDate >= startDate && visitorDate <= endDate;
    });

  console.log("visitor", typeof siteId);
  console.log("filteredVisitors", filteredVisitors);

  const filteredSiteVisitors = visitors?.filter(
    //@ts-expect-error
    (visitor) => visitor.siteId === parseInt(siteId)
  );

  const personnelOnDuty = users?.filter((user: any) =>
    filteredSiteVisitors.some((visitor: any) => visitor.userId === user.id)
  );
  
  return (
    <div>
      <div ref={tableRef}>
        <Table
          headers={[
            "Visitor",
            "Phone Number",
            "ID Number",
            "Visiting",
            "Date",
            "Time In",
            "Time Out",
            "Personnel On Duty",
          ]}
          isHeader={false}
          data={filteredSiteVisitors}
          renderRow={(visitor) => (
            <>
              <td>{visitor?.name}</td>
              <td>{visitor?.phone}</td>
              <td>{visitor?.idNumber}</td>
              <td>{visitor?.visiting}</td>
              <td>{formatDate(visitor?.createdAt)}</td>
              <td>{formatTime(visitor?.entryTime)}</td>
              {visitor?.exitTime ? (
                <td>{formatTime(visitor?.exitTime)}</td>
              ) : (
                <td className="td-red">Still on-site</td>
              )}
              {personnelOnDuty?.map((personnel: any) => (
                <td key={personnel.id}>
                  {personnel?.firstName} {personnel?.lastName}
                </td>
              ))}
            </>
          )}
          buttonName="Add Personnel"
          isVisitors={true}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDownloadClick={() => downloadFilteredCSV(filteredVisitors)}
          emptyStateMessage="No visitors available."
          emptyStateImage="/visitor.svg"
          itemsPerPage={20}
        />
      </div>
    </div>
  );
};

export default VisitorsTable;
