import useFetchVisitors from "../../hooks/useFetchVisitors";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import { useParams } from "react-router-dom";
import "./styles.scss";

const Table = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();
  const { personnel } = useFetchPersonnel();
  const { siteId } = useParams<{ siteId: string }>();
  
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

  console.log('filteredPersonnel', filteredPersonnel)
  // Function to extract time in HH:MM format
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      {filteredVisitors.length === 0 ? (
        <p>No log available.</p>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Phone Number</th>
              <th>ID Number</th>
              <th>Visiting</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Personnel On Duty</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors?.map((visitor: any) => (
              <tr key={visitor.id}>
                <td>{visitor?.name}</td>
                <td>{visitor?.phoneNumber}</td>
                <td>{visitor?.id_number}</td>
                <td>{visitor?.visiting_resident}</td>
                <td>{formatTime(visitor?.entry_time)}</td>

                {visitor?.exit_time ? (
                  <td>{formatTime(visitor?.exit_time)}</td>
                ) : (
                  <td className="td-red">Still on-site</td>
                )}
                {filteredPersonnel?.map((personnel: any) => (
                  <td>{personnel?.username}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
