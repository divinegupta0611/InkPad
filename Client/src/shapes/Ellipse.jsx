import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Ellipse, Transformer } from 'react-konva';

const DraggableResizableEllipse = ({ isSelected, onSelect, onChange, ...props }) => {
  const ellipseRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && ellipseRef.current) {
      // Attach transformer to the ellipse
      trRef.current.nodes([ellipseRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = ellipseRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new radii based on scale
    const newRadiusX = Math.max(5, props.radiusX * scaleX);
    const newRadiusY = Math.max(5, props.radiusY * scaleY);
    
    // Reset scale and apply to radii
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      radiusX: newRadiusX,
      radiusY: newRadiusY,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Ellipse
        ref={ellipseRef}
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
  const [ellipses, setEllipses] = useState([
    {
      id: 'ellipse1',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radiusX: 100,
      radiusY: 50,
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

  const handleEllipseChange = (newAttrs) => {
    setEllipses(ellipses.map(ellipse => 
      ellipse.id === newAttrs.id ? newAttrs : ellipse
    ));
  };

  const addNewEllipse = () => {
    const newEllipse = {
      id: `ellipse${ellipses.length + 1}`,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      radiusX: 50 + Math.random() * 50,
      radiusY: 30 + Math.random() * 40,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0
    };
    setEllipses([...ellipses, newEllipse]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setEllipses(ellipses.filter(ellipse => ellipse.id !== selectedId));
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
          onClick={addNewEllipse}
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
          Add Ellipse
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
          Click an ellipse to select it, then drag to move or use handles to resize.
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
          {ellipses.map((ellipse) => (
            <DraggableResizableEllipse
              key={ellipse.id}
              {...ellipse}
              isSelected={ellipse.id === selectedId}
              onSelect={() => handleSelect(ellipse.id)}
              onChange={handleEllipseChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;