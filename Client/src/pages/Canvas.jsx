import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Rect, Ellipse, Line, RegularPolygon, Star, Arrow, Transformer } from 'react-konva';

const DraggableShape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let updatedProps = {
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    // Update dimensions based on scale
    if (shapeProps.type === 'circle') {
      updatedProps.radius = Math.max(5, shapeProps.radius * Math.min(scaleX, scaleY));
    } else if (shapeProps.type === 'rectangle') {
      updatedProps.width = Math.max(10, shapeProps.width * scaleX);
      updatedProps.height = Math.max(10, shapeProps.height * scaleY);
    } else if (shapeProps.type === 'ellipse') {
      updatedProps.radiusX = Math.max(5, shapeProps.radiusX * scaleX);
      updatedProps.radiusY = Math.max(5, shapeProps.radiusY * scaleY);
    } else if (shapeProps.type === 'polygon' || shapeProps.type === 'star') {
      updatedProps.radius = Math.max(5, shapeProps.radius * Math.min(scaleX, scaleY));
      if (shapeProps.type === 'star') {
        updatedProps.innerRadius = Math.max(5, shapeProps.innerRadius * Math.min(scaleX, scaleY));
        updatedProps.outerRadius = Math.max(5, shapeProps.outerRadius * Math.min(scaleX, scaleY));
      }
    } else if (shapeProps.type === 'line' || shapeProps.type === 'arrow') {
      updatedProps.points = shapeProps.points.map((point, index) => {
        return index % 2 === 0 ? point * scaleX : point * scaleY;
      });
    }

    onChange(updatedProps);
  };

  const commonProps = {
    ref: shapeRef,
    draggable: true,
    x: shapeProps.x,
    y: shapeProps.y,
    rotation: shapeProps.rotation,
    fill: shapeProps.fill,
    stroke: shapeProps.stroke,
    strokeWidth: shapeProps.strokeWidth,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  let shape;
  switch (shapeProps.type) {
    case 'circle':
      shape = <Circle {...commonProps} radius={shapeProps.radius} />;
      break;
    case 'rectangle':
      shape = <Rect {...commonProps} width={shapeProps.width} height={shapeProps.height} />;
      break;
    case 'ellipse':
      shape = <Ellipse {...commonProps} radiusX={shapeProps.radiusX} radiusY={shapeProps.radiusY} />;
      break;
    case 'polygon':
      shape = <RegularPolygon {...commonProps} radius={shapeProps.radius} sides={shapeProps.sides} />;
      break;
    case 'star':
      shape = <Star {...commonProps} numPoints={shapeProps.numPoints} innerRadius={shapeProps.innerRadius} outerRadius={shapeProps.outerRadius} />;
      break;
    case 'line':
      shape = <Line {...commonProps} points={shapeProps.points} />;
      break;
    case 'arrow':
      shape = <Arrow {...commonProps} points={shapeProps.points} />;
      break;
    case 'pen':
      shape = <Line {...commonProps} points={shapeProps.points} lineCap="round" lineJoin="round" />;
      break;
    default:
      shape = null;
  }

  return (
    <>
      {shape}
      {isSelected && shapeProps.type !== 'pen' && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const Canvas = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ff5722');
  const [tool, setTool] = useState('select'); // 'select', 'pen', 'eraser'
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [penWidth, setPenWidth] = useState(3);
  const [eraserSize, setEraserSize] = useState(20);

  const primaryColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#00bcd4', '#4caf50'
  ];

  const checkDeselect = (e) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
    }
  };

  const handleMouseDown = (e) => {
    if (tool === 'pen') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setCurrentPath([pos.x, pos.y]);
    } else if (tool === 'eraser') {
      const pos = e.target.getStage().getPointerPosition();
      eraseAtPosition(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    if (tool === 'pen') {
      setCurrentPath([...currentPath, point.x, point.y]);
    } else if (tool === 'eraser') {
      eraseAtPosition(point.x, point.y);
    }
  };

  const handleMouseUp = () => {
    if (tool === 'pen' && isDrawing) {
      // Add the drawn path as a new shape
      const newShape = {
        id: Date.now(),
        type: 'pen',
        points: currentPath,
        stroke: selectedColor,
        strokeWidth: penWidth,
        x: 0,
        y: 0,
        rotation: 0,
      };
      setShapes([...shapes, newShape]);
      setCurrentPath([]);
    }
    setIsDrawing(false);
  };

  const eraseAtPosition = (x, y) => {
    setShapes(prevShapes => 
      prevShapes.filter(shape => {
        // Check if the eraser position intersects with the shape
        const dx = x - shape.x;
        const dy = y - shape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Simple collision detection - adjust based on shape type
        let threshold = eraserSize / 2;
        if (shape.type === 'circle') {
          threshold += shape.radius;
        } else if (shape.type === 'rectangle') {
          threshold += Math.max(shape.width, shape.height) / 2;
        } else if (shape.type === 'ellipse') {
          threshold += Math.max(shape.radiusX, shape.radiusY);
        } else if (shape.type === 'polygon' || shape.type === 'star') {
          threshold += shape.radius || shape.outerRadius || 50;
        } else if (shape.type === 'pen') {
          // For pen strokes, check if any point is within eraser range
          for (let i = 0; i < shape.points.length; i += 2) {
            const pointX = shape.points[i] + shape.x;
            const pointY = shape.points[i + 1] + shape.y;
            const pointDistance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
            if (pointDistance < eraserSize / 2) {
              return false; // Remove this shape
            }
          }
          return true; // Keep this shape
        } else {
          threshold += 30; // Default threshold for other shapes
        }
        
        return distance > threshold;
      })
    );
  };

  const addShape = (type) => {
    const id = Date.now();
    let newShape = {
      id,
      type,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      fill: selectedColor,
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0,
    };

    switch (type) {
      case 'circle':
        newShape.radius = 50;
        break;
      case 'rectangle':
        newShape.width = 100;
        newShape.height = 60;
        break;
      case 'ellipse':
        newShape.radiusX = 80;
        newShape.radiusY = 40;
        break;
      case 'polygon':
        newShape.radius = 50;
        newShape.sides = 6;
        break;
      case 'star':
        newShape.numPoints = 5;
        newShape.innerRadius = 30;
        newShape.outerRadius = 60;
        break;
      case 'line':
        newShape.points = [-50, 0, 50, 0];
        newShape.stroke = selectedColor;
        newShape.strokeWidth = 4;
        delete newShape.fill;
        break;
      case 'arrow':
        newShape.points = [-50, 0, 50, 0];
        newShape.stroke = selectedColor;
        newShape.strokeWidth = 4;
        break;
    }

    setShapes([...shapes, newShape]);
  };

  const updateShape = (newAttrs) => {
    setShapes(shapes.map(shape => 
      shape.id === newAttrs.id ? newAttrs : shape
    ));
  };

  const deleteSelected = () => {
    if (selectedId) {
      setShapes(shapes.filter(shape => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearCanvas = () => {
    setShapes([]);
    setSelectedId(null);
  };

  const changeSelectedShapeColor = (color) => {
    if (selectedId) {
      setShapes(shapes.map(shape => 
        shape.id === selectedId ? { ...shape, fill: color, stroke: color } : shape
      ));
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        maxWidth: '320px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Drawing Tools</h3>
        
        {/* Tool Selection */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            Current Tool: <span style={{ color: '#2196f3' }}>{tool.charAt(0).toUpperCase() + tool.slice(1)}</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            {[
              { tool: 'select', label: 'Select', icon: '⟲' },
              { tool: 'pen', label: 'Pen', icon: '✏️' },
              { tool: 'eraser', label: 'Eraser', icon: '🧽' }
            ].map(({ tool: toolType, label, icon }) => (
              <button
                key={toolType}
                onClick={() => setTool(toolType)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: tool === toolType ? '#2196f3' : '#f5f5f5',
                  color: tool === toolType ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pen/Eraser Settings */}
        {tool === 'pen' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Pen Width: {penWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={penWidth}
              onChange={(e) => setPenWidth(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {tool === 'eraser' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Eraser Size: {eraserSize}px
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={eraserSize}
              onChange={(e) => setEraserSize(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
        
        {/* Color Palette */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            Current Color: <span style={{ color: selectedColor }}>●</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
            {primaryColors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{
                width: '30px',
                height: '24px',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            />
          </div>
          {selectedId && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <button
                onClick={() => changeSelectedShapeColor(selectedColor)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                Apply Color to Selected
              </button>
            </div>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '15px' }}>
          {[
            { type: 'circle', label: 'Circle', icon: '●' },
            { type: 'rectangle', label: 'Rectangle', icon: '▬' },
            { type: 'ellipse', label: 'Ellipse', icon: '⬭' },
            { type: 'polygon', label: 'Polygon', icon: '⬢' },
            { type: 'star', label: 'Star', icon: '★' },
            { type: 'line', label: 'Line', icon: '─' },
            { type: 'arrow', label: 'Arrow', icon: '→' }
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => addShape(type)}
              style={{
                padding: '8px 4px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                minHeight: '50px'
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ fontSize: '10px' }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button onClick={deleteSelected} disabled={!selectedId} style={{
            flex: 1, padding: '8px 12px', backgroundColor: selectedId ? '#f44336' : '#ccc',
            color: 'white', border: 'none', borderRadius: '6px', cursor: selectedId ? 'pointer' : 'not-allowed'
          }}>
            Delete
          </button>
          <button onClick={clearCanvas} style={{
            flex: 1, padding: '8px 12px', backgroundColor: '#ff9800',
            color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
          }}>
            Clear All
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#666' }}>
          <strong>Mode:</strong> {tool} | <strong>Shapes:</strong> {shapes.length} | <strong>Selected:</strong> {selectedId || 'None'}
          <br />
          {tool === 'pen' && 'Click and drag to draw freely'}
          {tool === 'eraser' && 'Click and drag to erase'}
          {tool === 'select' && 'Click shapes to select • Drag to move • Use handles to resize'}
        </div>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ cursor: tool === 'pen' ? 'crosshair' : tool === 'eraser' ? 'not-allowed' : 'default' }}
      >
        <Layer>
          {shapes.map((shape) => (
            <DraggableShape
              key={shape.id}
              shapeProps={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => tool === 'select' && setSelectedId(shape.id)}
              onChange={updateShape}
            />
          ))}
          {/* Show current drawing path */}
          {isDrawing && currentPath.length > 0 && (
            <Line
              points={currentPath}
              stroke={selectedColor}
              strokeWidth={penWidth}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;