import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Transformer } from 'react-konva';

const DraggableResizableLine = ({ isSelected, onSelect, onChange, ...props }) => {
  const lineRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && lineRef.current) {
      // Attach transformer to the line
      trRef.current.nodes([lineRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = lineRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Calculate new points based on scale
    const newPoints = [];
    for (let i = 0; i < props.points.length; i += 2) {
      newPoints.push(props.points[i] * scaleX);
      newPoints.push(props.points[i + 1] * scaleY);
    }
    
    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      points: newPoints,
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Line
        ref={lineRef}
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
  const [lines, setLines] = useState([
    {
      id: 'line1',
      x: 50,
      y: 50,
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: 'red',
      strokeWidth: 15,
      lineCap: 'round',
      lineJoin: 'round',
      rotation: 0
    },
    {
      id: 'line2',
      x: 50,
      y: 100,
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: 'green',
      strokeWidth: 2,
      lineJoin: 'round',
      dash: [33, 10],
      rotation: 0
    },
    {
      id: 'line3',
      x: 50,
      y: 150,
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: 'blue',
      strokeWidth: 10,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [29, 20, 0.001, 20],
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

  const handleLineChange = (newAttrs) => {
    setLines(lines.map(line => 
      line.id === newAttrs.id ? newAttrs : line
    ));
  };

  const generateRandomPoints = () => {
    const numPoints = 3 + Math.floor(Math.random() * 4); // 3-6 points
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push(i * 80 + Math.random() * 40); // x
      points.push(20 + Math.random() * 60); // y
    }
    return points;
  };

  const addNewLine = () => {
    const lineStyles = [
      { stroke: 'red', strokeWidth: 15, lineCap: 'round', lineJoin: 'round' },
      { stroke: 'green', strokeWidth: 2, lineJoin: 'round', dash: [33, 10] },
      { stroke: 'blue', strokeWidth: 10, lineCap: 'round', lineJoin: 'round', dash: [29, 20, 0.001, 20] },
      { stroke: 'purple', strokeWidth: 8, lineCap: 'square', lineJoin: 'miter' },
      { stroke: 'orange', strokeWidth: 5, dash: [20, 5] },
      { stroke: 'teal', strokeWidth: 12, lineCap: 'round', dash: [15, 15] }
    ];
    
    const randomStyle = lineStyles[Math.floor(Math.random() * lineStyles.length)];
    const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    
    const newLine = {
      id: `line${lines.length + 1}`,
      x: Math.random() * (window.innerWidth - 400) + 50,
      y: Math.random() * (window.innerHeight - 200) + 50,
      points: generateRandomPoints(),
      stroke: randomColor,
      strokeWidth: 3 + Math.random() * 10,
      lineCap: Math.random() > 0.5 ? 'round' : 'square',
      lineJoin: Math.random() > 0.5 ? 'round' : 'miter',
      dash: Math.random() > 0.7 ? [20, 10] : undefined,
      rotation: 0
    };
    setLines([...lines, newLine]);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setLines(lines.filter(line => line.id !== selectedId));
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
          onClick={addNewLine}
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
          Add Line
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
          Click a line to select it, then drag to move or use handles to resize.
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
          {lines.map((line) => (
            <DraggableResizableLine
              key={line.id}
              {...line}
              isSelected={line.id === selectedId}
              onSelect={() => handleSelect(line.id)}
              onChange={handleLineChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;