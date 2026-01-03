import { useState, useEffect } from "react";

export function useAsync<T>(
  defaultValue: T,
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    asyncFunction()
      .then((result) => {
        if (isMounted) setValue(result);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { loading, error, value, setValue };
}

export function useAsyncInterval<T>(
  defaultValue: T,
  asyncFunction: () => Promise<T>,
  interval: number,
  dependencies: any[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let isMounted = true;

    const run = () => {
      setLoading(true);
      asyncFunction()
        .then((result) => {
          if (isMounted) setValue(result);
        })
        .catch((err) => {
          if (isMounted) setError(err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    const iid = setInterval(run, interval);

    run();

    return () => {
      isMounted = false;
      clearInterval(iid);
    };
  }, dependencies);

  return { loading, error, value, setValue };
}
