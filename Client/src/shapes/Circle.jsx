import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Transformer } from 'react-konva';

const DraggableResizableCircle = ({ isSelected, onSelect, onChange, ...props }) => {
  const circleRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && circleRef.current) {
      // Attach transformer to the circle
      trRef.current.nodes([circleRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = circleRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new radius based on scale (use the average of both scales to maintain circular shape)
    const newRadius = Math.max(5, props.radius * Math.min(scaleX, scaleY));
    
    // Reset scale and apply to radius
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      radius: newRadius,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Circle
        ref={circleRef}
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
          keepRatio={true}
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
  const [circles, setCircles] = useState([
    {
      id: 'circle1',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
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

  const handleCircleChange = (newAttrs) => {
    setCircles(circles.map(circle => 
      circle.id === newAttrs.id ? newAttrs : circle
    ));
  };

  const addNewCircle = () => {
    const newCircle = {
      id: `circle${circles.length + 1}`,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      radius: 30 + Math.random() * 50,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: 'black',
      strokeWidth: 2 + Math.random() * 4,
      rotation: 0
    };
    setCircles([...circles, newCircle]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setCircles(circles.filter(circle => circle.id !== selectedId));
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
          onClick={addNewCircle}
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
          Add Circle
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
          Click a circle to select it, then drag to move or use handles to resize.
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
          {circles.map((circle) => (
            <DraggableResizableCircle
              key={circle.id}
              {...circle}
              isSelected={circle.id === selectedId}
              onSelect={() => handleSelect(circle.id)}
              onChange={handleCircleChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;