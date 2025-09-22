import { render, screen } from '@testing-library/react';
import { Logo } from './logo';

describe('Logo', () => {
  it('renders the logo with the correct text', () => {
    render(<Logo />);
    
    // Check if the text "TaskEase" is in the document
    const logoText = screen.getByText('TaskEase');
    expect(logoText).toBeInTheDocument();
  });

  it('renders the CheckSquare icon', () => {
    // The icon doesn't have text, so we can't use getByText.
    // A robust way to test this would be to add a `data-testid` to the icon.
    // For now, we'll just check that the component renders without crashing.
    const { container } = render(<Logo />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // A better test would be more specific, e.g., checking for a class or a specific path within the SVG
  });
});
