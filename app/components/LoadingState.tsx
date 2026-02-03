interface LoadingStateProps {
  count?: number;
}

export function LoadingState({ count = 8 }: LoadingStateProps) {
  return (
    <ul className="main-list">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="loader">
          <div className="release-date"></div>
          <div className="title"></div>
        </li>
      ))}
    </ul>
  );
}
