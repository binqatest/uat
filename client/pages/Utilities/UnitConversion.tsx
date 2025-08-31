import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, HardDrive, Clock, Calendar } from 'lucide-react';

export default function UnitConversion() {
  // Data Converter State
  const [dataValue, setDataValue] = useState('');
  const [dataFromUnit, setDataFromUnit] = useState('byte');
  const [dataToUnit, setDataToUnit] = useState('mb');
  const [dataResult, setDataResult] = useState('');

  // Time Converter State
  const [timeValue, setTimeValue] = useState('');
  const [timeFromUnit, setTimeFromUnit] = useState('second');
  const [timeToUnit, setTimeToUnit] = useState('minute');
  const [timeResult, setTimeResult] = useState('');

  // Epoch Converter State
  const [epochValue, setEpochValue] = useState('');
  const [epochMode, setEpochMode] = useState('to_epoch');
  const [epochResult, setEpochResult] = useState('');

  const convertData = () => {
    const value = parseFloat(dataValue);
    
    const units: { [key: string]: number } = { 
      byte: 1, 
      kb: 1024, 
      mb: 1024 ** 2, 
      gb: 1024 ** 3, 
      tb: 1024 ** 4 
    };
    
    if (!value || isNaN(value) || !(dataFromUnit in units) || !(dataToUnit in units)) {
      setDataResult('Invalid input');
      return;
    }

    const result = value * (units[dataFromUnit] / units[dataToUnit]);
    setDataResult(`Result: ${result.toLocaleString()}`);
  };

  const convertTime = () => {
    const value = parseFloat(timeValue);
    
    const timeUnits: { [key: string]: number } = { 
      second: 1, 
      minute: 60, 
      hour: 3600, 
      day: 86400 
    };

    if (!value || isNaN(value) || !(timeFromUnit in timeUnits) || !(timeToUnit in timeUnits)) {
      setTimeResult('Invalid input');
      return;
    }

    const result = value * (timeUnits[timeFromUnit] / timeUnits[timeToUnit]);
    setTimeResult(`Result: ${result.toLocaleString()}`);
  };

  const convertEpoch = () => {
    const value = epochValue.trim();
    let result: string | number;

    if (epochMode === 'to_epoch') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        setEpochResult('Invalid date format');
        return;
      }
      result = Math.floor(date.getTime() / 1000);
      setEpochResult(`Result: ${result}`);
    } else if (epochMode === 'from_epoch') {
      const timestamp = parseInt(value, 10);
      if (isNaN(timestamp)) {
        setEpochResult('Invalid epoch');
        return;
      }
      result = new Date(timestamp * 1000).toISOString().replace('T', ' ').split('.')[0];
      setEpochResult(`Result: ${result}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Unit Converters</h1>
          <p className="text-muted-foreground">
            Convert between different units of measurement
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Unit Converters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Data Unit Converter */}
                <div className="converter space-y-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-brand" />
                    <h4 className="text-xl font-semibold">Data Unit Converter</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataValue">Value</Label>
                      <Input
                        id="dataValue"
                        type="number"
                        placeholder="Value"
                        value={dataValue}
                        onChange={(e) => setDataValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Select value={dataFromUnit} onValueChange={setDataFromUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="byte">Byte</SelectItem>
                          <SelectItem value="kb">KB</SelectItem>
                          <SelectItem value="mb">MB</SelectItem>
                          <SelectItem value="gb">GB</SelectItem>
                          <SelectItem value="tb">TB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="text-muted-foreground">To</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Select value={dataToUnit} onValueChange={setDataToUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="byte">Byte</SelectItem>
                          <SelectItem value="kb">KB</SelectItem>
                          <SelectItem value="mb">MB</SelectItem>
                          <SelectItem value="gb">GB</SelectItem>
                          <SelectItem value="tb">TB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Button 
                        onClick={convertData} 
                        className="w-full bg-brand hover:bg-brand-600"
                      >
                        Convert
                      </Button>
                    </div>
                  </div>
                  
                  {dataResult && (
                    <Alert>
                      <AlertDescription className="font-medium text-lg">
                        {dataResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator />

                {/* Time Converter */}
                <div className="converter space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand" />
                    <h4 className="text-xl font-semibold">Time Converter</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeValue">Value</Label>
                      <Input
                        id="timeValue"
                        type="number"
                        placeholder="Value"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Select value={timeFromUnit} onValueChange={setTimeFromUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="minute">Minute</SelectItem>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="text-muted-foreground">To</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Select value={timeToUnit} onValueChange={setTimeToUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="minute">Minute</SelectItem>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Button 
                        onClick={convertTime} 
                        className="w-full bg-brand hover:bg-brand-600"
                      >
                        Convert
                      </Button>
                    </div>
                  </div>
                  
                  {timeResult && (
                    <Alert>
                      <AlertDescription className="font-medium text-lg">
                        {timeResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator />

                {/* Epoch Time Converter */}
                <div className="converter space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand" />
                    <h4 className="text-xl font-semibold">Epoch Time Converter</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="epochValue">Input</Label>
                      <Input
                        id="epochValue"
                        type="text"
                        placeholder="YYYY-MM-DD HH:MM:SS or Epoch"
                        value={epochValue}
                        onChange={(e) => setEpochValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Mode</Label>
                      <Select value={epochMode} onValueChange={setEpochMode}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to_epoch">Human to Epoch</SelectItem>
                          <SelectItem value="from_epoch">Epoch to Human</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Button 
                        onClick={convertEpoch} 
                        className="w-full bg-brand hover:bg-brand-600"
                      >
                        Convert
                      </Button>
                    </div>
                  </div>
                  
                  {epochResult && (
                    <Alert>
                      <AlertDescription className="font-medium text-lg">
                        {epochResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Help Section */}
                <Separator />
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h5 className="font-semibold mb-2">Usage Tips:</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Data Converter:</strong> Convert between bytes, KB, MB, GB, and TB</p>
                    <p><strong>Time Converter:</strong> Convert between seconds, minutes, hours, and days</p>
                    <p><strong>Epoch Converter:</strong> 
                      - Human to Epoch: Enter date as "2024-01-15 14:30:00" or "2024-01-15"
                      <br />
                      - Epoch to Human: Enter epoch timestamp like "1705412400"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
