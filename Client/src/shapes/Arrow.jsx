import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Arrow, Transformer } from 'react-konva';

const DraggableResizableArrow = ({ isSelected, onSelect, onChange, ...props }) => {
  const arrowRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && arrowRef.current) {
      // Attach transformer to the arrow
      trRef.current.nodes([arrowRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = arrowRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new dimensions based on scale
    const [x1, y1, x2, y2] = props.points;
    const newPoints = [
      x1 * scaleX,
      y1 * scaleY,
      x2 * scaleX,
      y2 * scaleY
    ];
    
    const newPointerLength = Math.max(5, props.pointerLength * Math.min(scaleX, scaleY));
    const newPointerWidth = Math.max(5, props.pointerWidth * Math.min(scaleX, scaleY));
    
    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      points: newPoints,
      pointerLength: newPointerLength,
      pointerWidth: newPointerWidth,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Arrow
        ref={arrowRef}
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
  const [arrows, setArrows] = useState([
    {
      id: 'arrow1',
      x: window.innerWidth / 4,
      y: window.innerHeight / 4,
      points: [0, 0, 100, 100],
      pointerLength: 20,
      pointerWidth: 20,
      fill: 'black',
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

  const handleArrowChange = (newAttrs) => {
    setArrows(arrows.map(arrow => 
      arrow.id === newAttrs.id ? newAttrs : arrow
    ));
  };

  const addNewArrow = () => {
    const length = 80 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    const endX = Math.cos(angle) * length;
    const endY = Math.sin(angle) * length;
    
    const newArrow = {
      id: `arrow${arrows.length + 1}`,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      points: [0, 0, endX, endY],
      pointerLength: 15 + Math.random() * 10,
      pointerWidth: 15 + Math.random() * 10,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: `hsl(${Math.random() * 360}, 70%, 40%)`,
      strokeWidth: 2 + Math.random() * 3,
      rotation: 0
    };
    setArrows([...arrows, newArrow]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setArrows(arrows.filter(arrow => arrow.id !== selectedId));
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
          onClick={addNewArrow}
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
          Add Arrow
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
          Click an arrow to select it, then drag to move or use handles to resize.
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
          {arrows.map((arrow) => (
            <DraggableResizableArrow
              key={arrow.id}
              {...arrow}
              isSelected={arrow.id === selectedId}
              onSelect={() => handleSelect(arrow.id)}
              onChange={handleArrowChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;