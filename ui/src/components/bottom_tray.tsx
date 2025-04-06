import React from 'react';

const COLLAPSED_HEIGHT = 200;

const getCoordinatesFromEvent = (e: any) => {
  let [x, y] = [0, 0];
  if (e.clientX) {
    x = e.clientX;
    y = e.clientY;
  } else if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  return [x, y];
};

class BottomTray extends React.PureComponent<any, any> {
  private mouseTime: number;

  constructor(props: any) {
    super(props);
    this.state = {
      x: null,
      y: null,
      move: 0,
      resized: 0,
      bodyHeight: null,
    };
    this.mouseTime = 0;
  }

  componentDidUpdate(prevProps: any) {
    const { bodyHeight: newBodyHeight } = this.props;
    const { bodyHeight } = prevProps;
    const { move } = this.state;

    // Handle resize for bottom tray sizing
    const delta = bodyHeight ? newBodyHeight - bodyHeight : 0;
    this.setState({
      move: move < -COLLAPSED_HEIGHT ? move - delta : move,
    });
  }

  onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const [x, y] = getCoordinatesFromEvent(e);
    this.mouseTime = performance.now();
    this.setState({ x, y });
  };

  onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (this.state.x === null) {
      return;
    }
    const [x, y] = getCoordinatesFromEvent(e);
    this.setState(({ move }: { move: number }) => ({
      move: Math.max(move + y - this.state.y, -window.innerHeight + COLLAPSED_HEIGHT),
      y,
    }));
  };

  onPointerUp = () => {
    if (this.state.x === null) {
      return;
    }
    this.setState({
      x: null,
      y: null,
    });
    if (this.state.move < -COLLAPSED_HEIGHT - 50) {
      // Touch moved up by a significant value above the midway height
      this.setState({
        move: -window.innerHeight + COLLAPSED_HEIGHT,
      });
    } else {
      // Touch moved up but not significant
      this.setState({
        move: 0,
      });
    }
  };

  render() {
    const { headerContent, children } = this.props;
    return (
      <>
        <div id="bottom-tray">
          <div
            id="bottom-tray-header"
            onMouseDown={this.onPointerDown}
            onTouchStart={this.onPointerDown}
          >
            {headerContent}
          </div>
          <div id="bottom-tray-content">{children}</div>
        </div>
      </>
    );
  }
}

export default BottomTray;
