import "./ApplicationCard.css";

function ApplicationCard({ application, onDelete, onEdit }) {
    return (
        <div className="ApplicationBox">
            <div className="ApplicationInfo">
                <div className="ApplicationHeader">
                    <h3>{application.company}</h3>
                    
                    <span className={`Status ${application.status.toLowerCase()}`}>
                        {application.status}
                    </span>
                </div>

                <p>{application.position}</p>

            </div>

            <div className="ApplicationActions">
                <button onClick={onEdit}>Edit</button>
                <button onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}

export default ApplicationCard;