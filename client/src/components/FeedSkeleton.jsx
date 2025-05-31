import React from "react";

const FeedSkeleton = () => {
  return (
    <section className="FeedSkeleton">
      <article className="FeedSkeleton__item">
        <div className="header feedSkeleton__item-head">
          <div></div>
        </div>
        <div className="feedSkeleton__item-body"></div>
        <footer className="feedSkeleton__item-footer">
          <span></span>
          <span></span>
          <span></span>
        </footer>
      </article>

      <article className="feedSkeleton__item">
        <header className="feedSkeleton__item-head">
            <div></div>
        </header>
        <div className="feedSkeleton__item-body"></div>

          <footer className="feedSkeleton__item-footer">
          <span></span>
          <span></span>
          <span></span>
        </footer>
      </article>

      <article className="feedSkeleton__item">
        <header className="feedSkeleton__item-head">
            <div></div>
        </header>
        <div className="feedSkeleton__item-body">

        </div>

          <footer className="feedSkeleton__item-footer">
          <span></span>
          <span></span>
          <span></span>
        </footer>
      </article>
    </section>
  );
};

export default FeedSkeleton;
