'use client';

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'
import { channel } from 'diagnostics_channel';
import 'dotenv/config';
import DailyIframe from '@daily-co/daily-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_TOKEN || ''
const supabase = createClient(supabaseUrl,supabaseKey)


interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string,
  url?: string
}

export function LiveView({ url }: { url: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const callFrameRef = useRef<any>(null);
  const [runID, setRunID] = useState("")
  const [error, setError] = useState<string | null>(null);
  const effectRan = useRef(false);


  const monitor_room = (url: string) => {
    setIsLoading(true);
    setRunID(url);
    console.log(url)
    fetch(`${process.env.NEXT_PUBLIC_CEREBRIUM_URL}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CEREBRIUM_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"room_url": url})
    })
      .then(async response => {
        if (response.status === 200) {
          const data = await response.json();
        } else {
          throw new Error('Failed to join room');
        }
      })
      .catch(error => {
        console.error('Error fetching joining room:', error);
        setError('An error occurred while joining the room. Please refresh and try again');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    monitor_room(url);
  }, []);

  useEffect(() => {
    console.log('LiveView useEffect triggered with URL:', url);

    const createAndJoinCall = async () => {
      const container = document.getElementById('daily-video-container');
      if (!container) {
        console.error('Video container element not found');
        return;
      }

      try {
        console.log('Attempting to create DailyIframe');
        callFrameRef.current = DailyIframe.createFrame(container, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
          },
          showLeaveButton: true,
        });

        console.log('DailyIframe created, attempting to join call');
        await callFrameRef.current.join({ url });
        console.log('Successfully joined call');
      } catch (error) {
        console.error('Error creating or joining DailyIframe:', error);
      }
    };

    // Delay the creation of DailyIframe to ensure the DOM is ready
    setTimeout(createAndJoinCall, 100);

    return () => {
      if (callFrameRef.current) {
        console.log('Cleaning up DailyIframe instance');
        callFrameRef.current.destroy();
      }
    };
  }, [url]);

  useEffect(()=> {
    const getProducts = async () => {
      const { data } = await supabase.from("products").select().eq('run_id', runID);
      setIsLoading(false)
      if (data) {
        setProducts(data);
      }
    }

    getProducts()
  }, [runID])

  useEffect(()=> {
    const channel = supabase.channel('realtime products').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'products',
      filter: `run_id=eq.${runID}`
    }, (payload) => {
      console.log(payload)
      setProducts(prevProducts => {
        const newProduct = payload.new as Product;
        return [newProduct, ...prevProducts];
      });
    }).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [runID, supabase])

  return (
    <div className="grid md:grid-cols-[6fr_3fr] gap-6 max-w-full mx-auto p-4 md:p-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden" id="daily-video-container">
      </div>
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold mb-4 sticky top-0 z-10">Products</h2>
        <div className="overflow-auto max-h-[calc(80vh-3rem)] max-w-[70%]">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">Wait for the bot to join the meeting. Then products will appear as they are picked up...</p>
          ) : (
            products.map(product => (
              <Card key={product.id} className="p-4 mb-4">
                <div className="grid gap-4">
                  <img
                    src={product.image_url}
                    alt={`${product.name} Image`}
                    width={150}
                    height={150}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="grid gap-2">
                    <h4 className="font-bold">{product.name}</h4>
                    <p className="text-muted-foreground">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                      <Button onClick={() => window.open(product.url, '_blank')} size="sm">Buy Now</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}