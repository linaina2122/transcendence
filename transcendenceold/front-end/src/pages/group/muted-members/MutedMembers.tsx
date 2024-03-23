
import React from 'react';
import './MutedMembersStyle.css';
import CardItem from '../../../components/card-item/CardItem';

interface MutedMembersData {
  muted_members: Array<{ id: string; name: string; status: string; images: string[] }>;
  group_id: string | undefined;
}

type FooterButton = {
  text: string;
  onClick: () => void;
};

interface MutedMembersProps {
  data: MutedMembersData;
}

const MutedMembers: React.FC<MutedMembersProps>  = ({data}) => {

  const footerButtons = (id: string): FooterButton[] => [
  ];

  return (
    <div className="muted-members">
      <div className="muted-members-content">
        <div className="muted-members-title">Muted Members</div>
        <div className="muted-members-cards cards-content scrollbar">
          {data?.muted_members?.length > 0 &&
            data?.muted_members?.map((item, index) => {
              const key = `key-${index}`;
              return (
                <CardItem
                  key={key}
                  data={item}
                  footerButtons={footerButtons(item?.id)}
                />
              );
            })}
            {data?.muted_members?.length === 0 && <div className="empty-content">No muted members</div>}
        </div>
      </div>
    </div>
  )
}

export default MutedMembers