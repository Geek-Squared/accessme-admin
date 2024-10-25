import useFetchVisitors from "../../hooks/useFetchVisitors";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";  // DatePicker styles
import "./styles.scss";
import Table from "../table/Table";

const VisitorsTable = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();
  const { personnel } = useFetchPersonnel();
  const { siteId } = useParams<{ siteId: string }>();

  const tableRef = useRef<HTMLDivElement>(null);

  // State for date filtering
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(visitors)) {
    return <p>No visitors available.</p>;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(Math.floor(timestamp));
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
    const headers = ["Visitor", "Phone Number", "ID Number", "Visiting", "Date", "Time In", "Time Out", "Personnel On Duty"];

    const rows = filteredData.map((visitor: any) => {
      const personnelOnDuty = personnel
        .filter((person: any) => visitor.security_personnel.includes(person._id))
        .map((person: any) => person?.username)
        .join(", ");

      return [
        visitor?.name,
        visitor?.phoneNumber,
        visitor?.id_number,
        visitor?.visiting_resident,
        formatDate(visitor?._creationTime),
        formatTime(visitor?.entry_time),
        visitor?.exit_time ? formatTime(visitor?.exit_time) : "Still on-site",
        personnelOnDuty,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `visitors_data_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter visitors based on siteId and date range
  const filteredVisitors = visitors
    ?.filter((visitor: any) => visitor.siteId === siteId)
    ?.filter((visitor: any) => {
      if (!startDate || !endDate) return true;
      const visitorDate = new Date(visitor?._creationTime);
      return visitorDate >= startDate && visitorDate <= endDate;
    });

  const filteredPersonnel = personnel?.filter((person: any) =>
    filteredVisitors
      .map((visitor: any) => visitor.security_personnel)
      .includes(person._id)
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
          data={filteredVisitors}
          renderRow={(visitor) => (
            <>
              <td>{visitor?.name}</td>
              <td>{visitor?.phoneNumber}</td>
              <td>{visitor?.id_number}</td>
              <td>{visitor?.visiting_resident}</td>
              <td>{formatDate(visitor?._creationTime)}</td>
              <td>{formatTime(visitor?.entry_time)}</td>
              {visitor?.exit_time ? (
                <td>{formatTime(visitor?.exit_time)}</td>
              ) : (
                <td className="td-red">Still on-site</td>
              )}
              {filteredPersonnel?.map((personnel: any) => (
                <td key={personnel._id}>{personnel?.username}</td>
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