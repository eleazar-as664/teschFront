
import React, {  useRef } from 'react'; 
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';


function Solicitante() {
  const msgs = useRef(null);

    useMountEffect(() => {
        if (msgs.current) {
            msgs.current.clear();
            msgs.current.show({ id: '1', sticky: true, severity: 'info', summary: 'Info', detail: 'Solicitante paguina :b', closable: false });
        }
    }); 

    return (
        <div className="card flex justify-content-center">
            <Messages ref={msgs} />
        </div>
    )
}

export default Solicitante


