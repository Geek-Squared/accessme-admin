import useFetchVisitors from "../../hooks/useFetchVisitors";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import { useParams } from "react-router-dom";
import "./styles.scss";
import Table from "../table/Table";

const VisitorsTable = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();
  const { personnel } = useFetchPersonnel();
  const { siteId } = useParams<{ siteId: string }>();
  console.log('visitors', visitors);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(visitors)) {
    return <p>No visitors available.</p>;
  }

  // Filter visitors based on siteId
  const filteredVisitors = visitors?.filter(
    (visitor: any) => visitor.siteId === siteId
  );

  const filteredPersonnel = personnel?.filter((person: any) =>
    filteredVisitors
      .map((visitor: any) => visitor.security_personnel)
      .includes(person._id)
  );

  console.log("filteredPersonnel", filteredPersonnel);

  // Function to format Unix timestamp (in milliseconds) to a readable date format
  const formatDate = (timestamp: number) => {
    const date = new Date(Math.floor(timestamp)); // Ensure the timestamp is an integer
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to extract time in HH:MM format
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
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
            <td>{formatDate(visitor?._creationTime)}</td> {/* Format the timestamp */}
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
        emptyStateMessage="No visitors available."
        emptyStateImage="/visitor.svg"
        itemsPerPage={20}
      />
    </div>
  );
};

export default VisitorsTable;
