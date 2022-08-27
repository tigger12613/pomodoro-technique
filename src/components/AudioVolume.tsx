import * as React from 'react';
import { Button, Col, NavLink, Row, Container } from 'react-bootstrap';

export interface IAudioVolumeProps {
    volume:number
    setVolume:(volume:number)=>void
}

export function AudioVolume (props: IAudioVolumeProps) {
  return (
    <div>
         <Row>
            <Col>
                <div>
                    <label htmlFor="customRange3" className="form-label">Set Volume</label>
                </div>
            </Col>
            <Col>
                <div>
                    <input type="range" className="form-range" min="0" max="100" step="1"
                        value={props.volume}
                        onChange={(e) => { props.setVolume(Number(e.currentTarget.value)); }} />
                </div>
            </Col>
            <Col>
                <input type="text" value={props.volume} onChange={(e) => { props.setVolume(Number(e.currentTarget.value)) }} />
            </Col>
        </Row>
      
    </div>
  );
}
