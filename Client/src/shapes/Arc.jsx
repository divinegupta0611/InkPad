import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Arc, Transformer } from 'react-konva';

const DraggableResizableArc = ({ isSelected, onSelect, onChange, ...props }) => {
  const arcRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && arcRef.current) {
      // Attach transformer to the arc
      trRef.current.nodes([arcRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = arcRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new radius based on scale
    const newInnerRadius = props.innerRadius * Math.min(scaleX, scaleY);
    const newOuterRadius = props.outerRadius * Math.min(scaleX, scaleY);
    
    // Reset scale and apply to radius
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      innerRadius: newInnerRadius,
      outerRadius: newOuterRadius,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Arc
        ref={arcRef}
        {...props}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...props,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={handleTransform}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to prevent negative values
            if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const App = () => {
  const [arcs, setArcs] = useState([
    {
      id: 'arc1',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      innerRadius: 30,
      outerRadius: 60,
      angle: 90,
      fill: 'yellow',
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0
    }
  ]);
  
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleDeselect = () => {
    setSelectedId(null);
  };

  const handleArcChange = (newAttrs) => {
    setArcs(arcs.map(arc => 
      arc.id === newAttrs.id ? newAttrs : arc
    ));
  };
  const minX = window.innerWidth * 0.2;
  const maxX = window.innerWidth * 0.8;
  const minY = window.innerHeight * 0.3;
  const maxY = window.innerHeight * 0.7;
  const addNewArc = () => {
    const newArc = {
      id: `arc${arcs.length + 1}`,
      x: (minX + maxX) / 2,  // Center X of the range
      y: (minY + maxY) / 2,  // Center Y of the range
      innerRadius: 30,
      outerRadius: 60,
      angle: 90,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0
    };
    setArcs([...arcs, newArc]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setArcs(arcs.filter(arc => arc.id !== selectedId));
      setSelectedId(null);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={addNewArc}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Arc
        </button>
        <button 
          onClick={deleteSelected}
          disabled={!selectedId}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: selectedId ? '#f44336' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedId ? 'pointer' : 'not-allowed'
          }}
        >
          Delete Selected
        </button>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Click an arc to select it, then drag to move or use handles to resize.
          <br />
          Selected: {selectedId || 'None'}
        </div>
      </div>

      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={(e) => {
          // Deselect when clicking on empty area
          if (e.target === e.target.getStage()) {
            handleDeselect();
          }
        }}
      >
        <Layer>
          {arcs.map((arc) => (
            <DraggableResizableArc
              key={arc.id}
              {...arc}
              isSelected={arc.id === selectedId}
              onSelect={() => handleSelect(arc.id)}
              onChange={handleArcChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;