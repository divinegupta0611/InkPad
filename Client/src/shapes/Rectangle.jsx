import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const DraggableResizableRect = ({ isSelected, onSelect, onChange, ...props }) => {
  const rectRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && rectRef.current) {
      // Attach transformer to the rectangle
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = rectRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new dimensions based on scale
    const newWidth = Math.max(5, props.width * scaleX);
    const newHeight = Math.max(5, props.height * scaleY);
    
    // Reset scale and apply to dimensions
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Rect
        ref={rectRef}
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
  const [rectangles, setRectangles] = useState([
    {
      id: 'rect1',
      x: window.innerWidth / 2 - 50,
      y: window.innerHeight / 2 - 25,
      width: 100,
      height: 50,
      fill: 'green',
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

  const handleRectChange = (newAttrs) => {
    setRectangles(rectangles.map(rect => 
      rect.id === newAttrs.id ? newAttrs : rect
    ));
  };

  const addNewRect = () => {
    const newRect = {
      id: `rect${rectangles.length + 1}`,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      width: 80 + Math.random() * 40,
      height: 50 + Math.random() * 30,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0
    };
    setRectangles([...rectangles, newRect]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setRectangles(rectangles.filter(rect => rect.id !== selectedId));
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
          onClick={addNewRect}
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
          Add Rectangle
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
          Click a rectangle to select it, then drag to move or use handles to resize.
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
          {rectangles.map((rect) => (
            <DraggableResizableRect
              key={rect.id}
              {...rect}
              isSelected={rect.id === selectedId}
              onSelect={() => handleSelect(rect.id)}
              onChange={handleRectChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;