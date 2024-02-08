import React from "react";

interface ShowIocProps {
  id: number;
}


const ShowIoc: React.FC<ShowIocProps> = ({id}) => {
  return (
    <div className="p3 m-3">
      <h1>Ioc: {id}</h1>
    
    </div>
  );
};

export default ShowIoc;
