import './PulsedCardStyles.css'

const PulsedCard: React.FC<any> = ({ pulsedType }) => {
  return (
    <div className="pulsed-card" data-type={pulsedType}>
      <div className="pulsed-card-content">
        <div className="pulsed-card-header">
          <div className="pulsed-card-image">
          </div>
          <div className="pulsed-infos">
            <div className="pulsed-fullname"></div>
            <div className="pulsed-username"></div>
          </div>
        </div>
        <div className="pulsed-card-body">
          <div className="pulsed-stats">
            <div className="stats-infos" id="ranking">
              <div className="stats-number"></div>
              <p className="stats-title"></p>
            </div>
            <div className="stats-infos" id="pulsed-matches">
              <div className="stats-number"></div>
              <p className="stats-title"></p>
            </div>
            <div className="stats-infos" id="level">
              <div className="stats-number"></div>
              <p className="stats-title"></p>
            </div>
          </div>
        </div>
        {/* <div className="pulsed-card-footer"></div> */}
      </div>
    </div>
  );
};

export default PulsedCard;
