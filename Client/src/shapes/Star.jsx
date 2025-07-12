import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Star, Transformer } from 'react-konva';

const DraggableResizableStar = ({ isSelected, onSelect, onChange, ...props }) => {
  const starRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && starRef.current) {
      // Attach transformer to the star
      trRef.current.nodes([starRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = starRef.current;
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
      <Star
        ref={starRef}
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
  const [stars, setStars] = useState([
    {
      id: 'star1',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      numPoints: 5,
      innerRadius: 30,
      outerRadius: 70,
      fill: 'yellow',
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

  const handleStarChange = (newAttrs) => {
    setStars(stars.map(star => 
      star.id === newAttrs.id ? newAttrs : star
    ));
  };

  const addNewStar = () => {
    const newStar = {
      id: `star${stars.length + 1}`,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      numPoints: Math.floor(Math.random() * 6) + 3, // Random between 3-8 points
      innerRadius: 20 + Math.random() * 30, // Random between 20-50
      outerRadius: 50 + Math.random() * 40, // Random between 50-90
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0
    };
    setStars([...stars, newStar]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setStars(stars.filter(star => star.id !== selectedId));
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
          onClick={addNewStar}
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
          Add Star
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
          Click a star to select it, then drag to move or use handles to resize.
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
          {stars.map((star) => (
            <DraggableResizableStar
              key={star.id}
              {...star}
              isSelected={star.id === selectedId}
              onSelect={() => handleSelect(star.id)}
              onChange={handleStarChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;